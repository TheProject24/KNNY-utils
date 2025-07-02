const handleServerError = (res, err) => {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
};

const handleNotFound = (resource, res) => {
    if (!resource) {
        res.status(404).json({ error: 'Not Found' });
        return true;
    }
    return false;
};

module.exports = { handleNotFound, handleServerError}