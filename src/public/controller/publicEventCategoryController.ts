import { Req, Res } from '@common/types/expressTypes';
import publicEventCategoryRepository from '../repository/publicEventCategoryRepository';
import { BadRequestError } from '@common/errors/bad-request-error';

class PublicEventCategoryController {
    async getActiveCategories(req: Req, res: Res) {
        const { search, page = '1', limit = '20' } = req.query;
        
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const options: any = {
            limit: limitNum,
            skip,
        };

        if (search) {
            options.search = search;
        }

        const [categories, total] = await Promise.all([
            publicEventCategoryRepository.findActiveCategories(options),
            publicEventCategoryRepository.countActiveCategories({
                ...(search && { search: search as string }),
            }),
        ]);

        const responseCategories = categories.map((category) => ({
            _id: category._id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            color: category.color,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }));

        res.status(200).json({
            success: true,
            data: {
                categories: responseCategories,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalItems: total,
                    itemsPerPage: limitNum,
                },
            },
        });
    }

    async getCategoryBySlug(req: Req, res: Res) {
        const { slug } = req.params;

        const category = await publicEventCategoryRepository.findCategoryBySlug(slug);

        if (!category) {
            throw new BadRequestError('Category not found');
        }

        const responseCategory = {
            _id: category._id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            color: category.color,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };

        res.status(200).json({
            success: true,
            data: {
                category: responseCategory,
            },
        });
    }

    async getAllActiveCategories(req: Req, res: Res) {
        const categories = await publicEventCategoryRepository.findAllActiveCategories();

        const responseCategories = categories.map((category) => ({
            _id: category._id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            color: category.color,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }));

        res.status(200).json({
            success: true,
            data: {
                categories: responseCategories,
            },
        });
    }
}

export default new PublicEventCategoryController();