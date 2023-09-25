export const transposeMatrix = (matrix: any[][]) => {
  return matrix[0].map((col, colIdx) => matrix.map((row) => row[colIdx]));
};
