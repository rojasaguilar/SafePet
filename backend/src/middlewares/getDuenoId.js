import express from "express";

export const getDuenoId = (req, res, next) => {
  req.duenoId = req.params.id;
  next();
};
