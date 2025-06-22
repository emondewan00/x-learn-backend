function getPagination(query: any, defaultLimit = 10) {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.max(1, parseInt(query.limit as string) || defaultLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export default getPagination;
