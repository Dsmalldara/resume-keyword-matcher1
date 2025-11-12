/**
 * @swagger
 * /coverletters/letters:
 *   get:
 *     summary: List saved cover letters for the authenticated user
 *     description: Returns a paginated list of cover letters for the authenticated user's profile
 *     tags:
 *       - Cover Letters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: A list of cover letters belonging to the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cover letters fetched successfully
 *                 coverLetters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CoverLetter'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       example: 42
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Validation error or bad request (e.g., invalid pagination params)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid pagination parameters
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         description: User profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User profile not found
 *       500:
 *         $ref: '#/components/schemas/Error'
 *
 * /coverletters/letters-single/{id}:
 *   get:
 *     summary: Get a single cover letter by ID
 *     tags:
 *       - Cover Letters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cover letter details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cover letter fetched successfully
 *                 coverLetter:
 *                   $ref: '#/components/schemas/CoverLetter'
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         description: Unauthorized to access this cover letter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized to access this cover letter
 *       404:
 *         description: Cover letter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cover letter not found
 *       500:
 *         $ref: '#/components/schemas/Error'
 */



import { Router, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { AuthMiddleware } from '../../../middleware/auth';
import prisma from '../../../lib/prisma';
import logger from '../../../../utils/logger';
import { getIndividualLetterValidation } from '../validations/coverLetterValidation';

const router = Router();


// GET /coverletters/:id - fetch a single cover letter (ownership enforced)
router.get( '/letters-single/:id',AuthMiddleware,getIndividualLetterValidation, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user?.id!;
    const { id } = req.params;
    try {
      const coverLetter = await prisma.coverLetter.findUnique({
        where: { id },
        select: {
          id: true,
          profileId: true,
          resumeId: true,
          jobId: true,
          fullText: true,
          preview: true,
          customNotes: true,
          updatedAt: true,
          job: { select: { id: true, title: true } },
          profile: { select: { userId: true } },
        },
      });

      if (!coverLetter) {
        return res.status(404).json({ error: 'Cover letter not found' });
      }

      if (coverLetter.profile.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to access this cover letter' });
      }

      // strip nested profile.userId from response
      const { profile: _p, ...payload } = coverLetter as any;

      return res.status(200).json({ message: "Cover letter fetched successfully", ...payload });
    } catch (error) {
      logger.error('Error fetching cover letter', { error });
      return res.status(500).json({ error: 'Failed to fetch cover letter' });
    }
  }
);



// GET /coverletters - list cover letters for authenticated user
router.get('/letters', AuthMiddleware, async (req: Request, res: Response) => {
  logger.info('Fetching cover letters for user');
 const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  const page = parseInt((req.query.page as string) || "1", 10);
  const perPage = parseInt((req.query.perPage as string) || "10", 10);

  if (Number.isNaN(page) || Number.isNaN(perPage) || page < 1 || perPage < 1 || perPage > 100) {
    return res.status(400).json({ error: 'Invalid pagination parameters' });
  }

  try {
    const profile = await prisma.profile.findFirst({ where: { userId: userId }, select: { id: true } });
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const where = { profileId: profile.id };

    const totalItems = await prisma.coverLetter.count({ where });

    const coverLetters = await prisma.coverLetter.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        resumeId: true,
        jobId: true,
        preview: true,
        customNotes: true,
        updatedAt: true,
        job: {
          select: { id: true, title: true }
        },
        resume: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalPages = Math.ceil(totalItems / perPage) || 1;

    return res.status(200).json({
      coverLetters,
      message: 'Cover letters fetched successfully',
      pagination: {
        page,
        perPage,
        totalItems,
        totalPages,
      }
    });
  } catch (error) {
    logger.error('Error fetching cover letters', { error });
    return res.status(500).json({ error: 'Failed to fetch cover letters' });
  }
});


export default router;
