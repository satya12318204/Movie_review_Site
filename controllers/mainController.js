exports.renderGuestPage = (req, res) => {
  res.render("guest");
};


exports.renderDummyPage = (req, res) => {
  res.render("dummy");
};
exports.renderAdminPortalPage = (req, res) => {
  res.render("adminportal");
};

exports.renderSuperUserPortalPage = (req, res) => {
  res.render("superuser");
};

exports.renderMainPage = (req, res) => {
  res.render("main");
}