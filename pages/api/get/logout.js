import { ApiRoute } from "@/lib/config";

export default ApiRoute(
  async function handler(req, res) {
    req.session.destroy();
    res.status(200).json({message: 'Successfully logged out'});
  }
)
