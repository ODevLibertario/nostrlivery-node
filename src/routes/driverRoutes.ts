import { Router, Request, Response } from 'express'
import {DriverService} from "../service/DriverService";
import {wrapResponseBody} from "../app";

const driverRouter = Router();

const driverService = new DriverService()

driverRouter.get('/driver/company-associations/:npub', async (req: Request, res: Response) => {
    const associations = await driverService.getCompanyAssociations(req.params.npub)
    res.status(200).send(wrapResponseBody(associations));
});

export default driverRouter;
