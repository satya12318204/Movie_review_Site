class ChineseWall {
    constructor() {
        this.accessHistory = {};
    }

    grantAccess(role, document) {
        if (!(role in this.accessHistory)) {
            this.accessHistory[role] = new Set();
        }
        this.accessHistory[role].add(document);
    }

    checkAccess(role, document) {
        for (let roleDocs of Object.values(this.accessHistory)) {
            if (roleDocs.has(document)) {
                return false;
            }
        }
        return true;
    }

    // Define the middleware method
    middleware(allowedRoles) {
        return (req, res, next) => {
            const userRole = req.userRole; // Assuming userRole is set by the setUserRole middleware
            if (allowedRoles.includes(userRole)) {
                return res.status(403).send("Access Denied");
            }
            next();
        };
    }
}

module.exports = ChineseWall;
