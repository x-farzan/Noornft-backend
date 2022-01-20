exports.paginator = (array, pageSize, pageNumber) => {
  // return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  return array.slice(0, pageNumber * pageSize);
};
