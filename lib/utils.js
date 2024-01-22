
export const validApiRequest = (req, res, currentMethod) => {

    if (currentMethod == "POST" && req.method !== "POST") {
        res.status(504).send({ message: 'Only POST requests allowed' });
        return false;
    }

    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return false;
    }

    return true;

}