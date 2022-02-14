const fs = require("fs");

//ADD change
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
	//TODO fix
	//This is assuming that the old file is longer than the other one
	//This is bad
	const stream = fs.createWriteStream(filePath, { flags: "w" });
	const split = oldData.split("\n");
	console.log("Old data in file utils");
	console.log(oldData);
	console.log("Seen in fileUtils");
	console.log(fileData);
	split.forEach((line, i) => {
		const newData =
			fileData.filter((line) => line.line === i);
		if (newData.length === 1) {
			//Write the new data if we received new data on that line number
			//TODO - fix so it will read character by character
			//Give preference to old characters if I have edited the line in the last packet cycle
			stream.write(newData[0].text + "\n");
		} else {
			//Otherwise write the old data
			stream.write(line + "\n");
		}
	});
	stream.end();
};
