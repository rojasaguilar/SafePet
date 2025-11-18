export const getDuenoId = (req, res, next) => {
  const queryObject = {
    ui_dueno: req.params.id,
  };

  req.queryObject = queryObject;

  next();
};
