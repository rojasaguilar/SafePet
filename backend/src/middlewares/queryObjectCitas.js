export const getQueryParams = (req, res, next) => {
  const { mascotaId } = req.params;

  const queryObject = {
    mascotaId,
  };
  next();
};
