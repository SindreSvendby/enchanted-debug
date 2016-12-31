export default function getPath(rootName, filePath) {
	const indexOf = filePath.indexOf(rootName, filePath);
	return filePath.substr(indexOf, Infinity);
}
