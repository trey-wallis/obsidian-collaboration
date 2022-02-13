const fs = require("fs");

//Compares and send changes on the lines that were changed
//Save the lines that I changed
export const getFileDiff = (oldFileData: string, newFileData: string) => {
	const oldSplit = oldFileData.split("\n");
	const newSplit = newFileData.split("\n");
	const diff: { line: number; text: string }[] = [];
	newSplit.forEach((line, i) => {
		if (newSplit.length >= i + 1) {
			if (line !== oldSplit[i]) {
				diff.push({
					line: i,
					text: line,
				});
			}
		}
	});
	return diff;
};

//In between each packet, compare line by line
//If there is new data, write that line
export const writeFileData = (
	filePath: string,
	oldData: string,
	fileData: { line: number; text: string }[]
) => {
	const stream = fs.createWriteStream(filePath, { flags: "w" });
	const split = oldData.split("\n");
	split.forEach((line, i) => {
		const newData =
			fileData.filter((line) => line.line === i)[0] || undefined;
		if (newData !== undefined) {
			//Write the new data if we received new data on that line number
			//TODO - fix so it will read character by character
			//Give preference to old characters if I have edited the line in the last packet cycle
			stream.write(newData.text + "\n");
		} else {
			//Otherwise write the old data
			stream.write(line + "\n");
		}
	});
	stream.end();
};
