const checkJsonFormat = (data) => {

  let jsonData;
  let error = false;
  let message = '';
  try {
    // Parse the data as JSON
    jsonData = JSON.parse(data);
  } catch (err) {
    error = true;
    message = `Error parsing JSON: ${err}`;
    return { error, message }
  }

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    error = true;
    message = 'Input file does not contain an array with at least one object.';
    return { error, message }
  }

  // Check the format of each object in the array
  for (const project of jsonData) {
    if (
      typeof project.title !== 'string' ||
      typeof project.description !== 'string' ||
      typeof project.longDescription !== 'string' ||
      !Array.isArray(project.authors) ||
      project.authors.some(author => (
        typeof author.name !== 'string' || typeof author.email !== 'string'
      )) ||
      !Array.isArray(project.files) ||
      project.files.some(file => (
        typeof file.title !== 'string' || typeof file.path !== 'string'
      ))
    ) {
      error = true;
      message = 'Invalid format for at least one document object.';
      return { error, message }
    }
  }
  
  return { error, jsonData }

}

module.exports = {
  checkJsonFormat
}