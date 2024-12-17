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
    const uniqueLeads = filterUniqueLeads(jsonData);

    fs.writeFileSync(outputFileName, JSON.stringify(uniqueLeads));
  } catch (err) {
    console.error(`Error processing file: ${err}`);
    process.exit(1);
  }
  return;
}

function filterUniqueLeads(jsonData) {
  const leads = jsonData.leads;
  const trackedLeads = leads.map((lead, index) => ({
    ...lead,
    originalIndex: index,
  }));

  let sortedLeads = trackedLeads.sort((a, b) => {
    const dateComparison = new Date(b.entryDate) - new Date(a.entryDate);
    return dateComparison !== 0
      ? dateComparison
      : b.originalIndex - a.originalIndex;
  });

  const seenIds = new Set();
  const seenEmails = new Set();

  sortedLeads = sortedLeads.filter((lead) => {
    if (seenIds.has(lead._id)) {
      // log id has already been used
      return false;
    }

    if (seenEmails.has(lead.email)) {
      // log email has already been used
      return false;
    }

    seenIds.add(lead._id);
    seenEmails.add(lead.email);

    return true;
  });

  const uniqueLeads = sortedLeads.map(({ originalIndex, ...lead }) => lead);

  return { leads: uniqueLeads };
}

// Main execution
const { inputFileName, outputFileName } = handleArgs();
parseJson(inputFileName, outputFileName);
