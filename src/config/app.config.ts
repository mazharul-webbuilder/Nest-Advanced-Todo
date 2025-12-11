export const appPaginationValue = () => ({
  defaultLimit: parseInt(process.env.APP_DEFAULT_PAGINATION || '5', 10),
});
