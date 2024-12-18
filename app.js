import fs from "fs";

function handleArgs() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("2 arguments required: input file, output file");
    process.exit(1);
  }

  const inputFileName = args[0];
  const outputFileName = args[1];

  if (!fs.existsSync(inputFileName)) {
    console.error(`File not found: ${inputFileName}`);
    process.exit(1);
  }

  return { inputFileName, outputFileName };
}

function parseJson(inputFileName, outputFileName) {
  try {
    const fileData = fs.readFileSync(inputFileName);
    const jsonData = JSON.parse(fileData);
    const { leads: uniqueLeads, changeLog } = filterDuplicateLeads(jsonData);

    fs.writeFileSync(outputFileName, JSON.stringify(uniqueLeads, null, 2));
    fs.writeFileSync("change_log.json", JSON.stringify(changeLog, null, 2));
  } catch (err) {
    console.error(`Error processing file: ${err}`);
    process.exit(1);
  }
  return;
}

function findFieldChanges(existingLead, duplicateLead) {
  const changes = [];

  for (const key in existingLead) {
    if (existingLead[key] !== duplicateLead[key]) {
      changes.push({
        source: existingLead,
        duplicate: duplicateLead,
        field: key,
        from: duplicateLead[key],
        to: existingLead[key],
      });
    }
  }

  if (changes.length === 0) {
    changes.push({
      source: existingLead,
      duplicate: duplicateLead,
      field: "",
      from: "",
      to: "",
    });
  }

  return changes;
}

function filterDuplicateLeads(jsonData) {
  const leads = jsonData.leads;
  const trackedLeads = leads.map((lead, index) => ({
    ...lead,
    originalIndex: index,
  }));

  const sortedLeads = trackedLeads
    .sort((a, b) => {
      const dateComparison = new Date(b.entryDate) - new Date(a.entryDate);
      return dateComparison !== 0
        ? dateComparison
        : b.originalIndex - a.originalIndex;
    })
    .map(({ originalIndex, ...lead }) => lead);

  const seenIds = new Set();
  const seenEmails = new Set();

  const filteredLeads = [];
  const changeLog = [];

  for (const lead of sortedLeads) {
    if (seenIds.has(lead._id) || seenEmails.has(lead.email)) {
      const existingLead = filteredLeads.find(
        (f) => f._id === lead._id || f.email === lead.email
      );
      changeLog.push(findFieldChanges(existingLead, lead));
      continue;
    }

    seenIds.add(lead._id);
    seenEmails.add(lead.email);
    filteredLeads.push(lead);
  }

  return { leads: filteredLeads, changeLog };
}

// Main execution
const { inputFileName, outputFileName } = handleArgs();
parseJson(inputFileName, outputFileName);
