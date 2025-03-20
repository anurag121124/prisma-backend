import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
    acceptRideController,
    declineRideController,
    startRideController,
    completeRideController,
    requestRideController,
    getRideDetailsController,
    cancelRideController,
    retryRideController,
    getRideStatusController,
    updateRideStatusController,
} from '../controllers/rideController';

const router = express.Router();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ride API',
            version: '1.0.0',
            description: 'API for managing ride requests and status',
        },
    },
    apis: ['./routes/rideRoutes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /rides/accept/{rideId}:
 *   post:
 *     summary: Accept a ride request
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride accepted successfully
 */
router.post('/rides/accept/:rideId', acceptRideController);

/**
 * @swagger
 * /rides/decline/{rideId}:
 *   post:
 *     summary: Decline a ride request
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride declined successfully
 */
router.post('/rides/decline/:rideId', declineRideController);

/**
 * @swagger
 * /rides/start/{rideId}:
 *   post:
 *     summary: Start a ride
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride started successfully
 */
router.post('/rides/start/:rideId', startRideController);

/**
 * @swagger
 * /rides/complete/{rideId}:
 *   post:
 *     summary: Complete a ride
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride completed successfully
 */
router.post('/rides/complete/:rideId', completeRideController);

/**
 * @swagger
 * /rides/request:
 *   post:
 *     summary: Request a ride
 *     responses:
 *       200:
 *         description: Ride requested successfully
 */
router.post('/rides/request', requestRideController);

/**
 * @swagger
 * /rides/{rideId}:
 *   get:
 *     summary: Get ride details
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride details retrieved successfully
 */
router.get('/rides/:rideId', getRideDetailsController);

/**
 * @swagger
 * /rides/cancel/{rideId}:
 *   post:
 *     summary: Cancel a ride
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride cancelled successfully
 */
router.post('/rides/cancel/:rideId', cancelRideController);

/**
 * @swagger
 * /rides/retry/{rideId}:
 *   post:
 *     summary: Retry a ride request
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride retried successfully
 */
router.post('/rides/retry/:rideId', retryRideController);

/**
 * @swagger
 * /rides/status/{rideId}:
 *   get:
 *     summary: Get ride status
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride status retrieved successfully
 */
router.get('/rides/status/:rideId', getRideStatusController);

/**
 * @swagger
 * /rides/update/{rideId}:
 *   post:
 *     summary: Update ride status
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride status updated successfully
 */
router.post('/rides/update/:rideId', updateRideStatusController);

export default router;