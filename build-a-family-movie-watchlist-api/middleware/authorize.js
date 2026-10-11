export function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function authorizeModification(req, res, next) {
  const isParent = req.user.role === "parent";
  const isSelfChild = req.user.role === "child" && String(req.params.userId) === String(req.user.id);

  if (!isParent && !isSelfChild) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}