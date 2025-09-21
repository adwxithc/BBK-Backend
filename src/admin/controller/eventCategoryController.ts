import { Req, Res } from '@common/types/expressTypes';
import eventCategoryRepository from '../repository/eventCategoryRepository';
import { BadRequestError } from '@common/errors/bad-request-error';

class EventCategoryController {
    async createCategory(req: Req, res: Res) {
        const { name, description, slug, color } = req.body;
        
        if (!req.user) {
            throw new BadRequestError('User not authenticated');
        }

        // Check if slug already exists
        const existingCategory = await eventCategoryRepository.checkSlugExists(slug);
        if (existingCategory) {
            throw new BadRequestError('A category with this slug already exists');
        }

        const categoryData = {
            name,
            description,
            slug: slug.toLowerCase(),
            color,
            createdBy: req.user.email,
        };

        const category = await eventCategoryRepository.create(categoryData);

        res.status(201).json({
            status: 201,
            success: true,
            data: {
                category: {
                    _id: category._id,
                    name: category.name,
                    description: category.description,
                    slug: category.slug,
                    color: category.color,
                    isActive: category.isActive,
                    createdBy: category.createdBy,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                }
            },
        });
    }

    async getAllCategories(req: Req, res: Res) {
        const { 
            isActive, 
            search,
            page = '1', 
            limit = '10' 
        } = req.query;

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const options: any = {
            limit: limitNum,
            skip,
        };

        if (isActive !== undefined) {
            options.isActive = isActive === 'true';
        }

        if (search) {
            options.search = search as string;
        }

        const [categories, total] = await Promise.all([
            eventCategoryRepository.findAll(options),
            eventCategoryRepository.count({
                ...(isActive !== undefined && { isActive: isActive === 'true' }),
                ...(search && { search: search as string })
            })
        ]);

        res.json({
            status: 200,
            success: true,
            data: {
                categories: categories.map(category => ({
                    _id: category._id,
                    name: category.name,
                    description: category.description,
                    slug: category.slug,
                    color: category.color,
                    isActive: category.isActive,
                    createdBy: category.createdBy,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                })),
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalItems: total,
                    itemsPerPage: limitNum,
                }
            },
        });
    }

    async getCategoryById(req: Req, res: Res) {
        const { id } = req.params;

        const category = await eventCategoryRepository.findById(id);
        if (!category) {
            throw new BadRequestError('Category not found');
        }

        res.json({
            status: 200,
            success: true,
            data: {
                category: {
                    _id: category._id,
                    name: category.name,
                    description: category.description,
                    slug: category.slug,
                    color: category.color,
                    isActive: category.isActive,
                    createdBy: category.createdBy,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                }
            },
        });
    }

    async updateCategory(req: Req, res: Res) {
        const { id } = req.params;
        const { name, description, slug, color } = req.body;

        // Check if category exists
        const existingCategory = await eventCategoryRepository.findById(id);
        if (!existingCategory) {
            throw new BadRequestError('Category not found');
        }

        // If slug is being updated, check if it's already taken by another category
        if (slug && slug !== existingCategory.slug) {
            const slugExists = await eventCategoryRepository.checkSlugExists(slug, id);
            if (slugExists) {
                throw new BadRequestError('A category with this slug already exists');
            }
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (slug !== undefined) updateData.slug = slug.toLowerCase();
        if (color !== undefined) updateData.color = color;

        const updatedCategory = await eventCategoryRepository.update(id, updateData);

        res.json({
            status: 200,
            success: true,
            data: {
                category: {
                    _id: updatedCategory!._id,
                    name: updatedCategory!.name,
                    description: updatedCategory!.description,
                    slug: updatedCategory!.slug,
                    color: updatedCategory!.color,
                    isActive: updatedCategory!.isActive,
                    createdBy: updatedCategory!.createdBy,
                    createdAt: updatedCategory!.createdAt,
                    updatedAt: updatedCategory!.updatedAt,
                }
            },
        });
    }

    async softDeleteCategory(req: Req, res: Res) {
        const { id } = req.params;

        const category = await eventCategoryRepository.findById(id);
        if (!category) {
            throw new BadRequestError('Category not found');
        }

        const deletedCategory = await eventCategoryRepository.softDelete(id);

        res.json({
            status: 200,
            success: true,
            message: 'Category soft deleted successfully',
            data: {
                category: {
                    _id: deletedCategory!._id,
                    name: deletedCategory!.name,
                    description: deletedCategory!.description,
                    slug: deletedCategory!.slug,
                    color: deletedCategory!.color,
                    isActive: deletedCategory!.isActive,
                    createdBy: deletedCategory!.createdBy,
                    createdAt: deletedCategory!.createdAt,
                    updatedAt: deletedCategory!.updatedAt,
                }
            },
        });
    }

    async toggleActiveStatus(req: Req, res: Res) {
        const { id } = req.params;
        const { isActive } = req.body;

        const category = await eventCategoryRepository.findById(id);
        if (!category) {
            throw new BadRequestError('Category not found');
        }

        const updatedCategory = await eventCategoryRepository.toggleActive(id, isActive);

        res.json({
            status: 200,
            success: true,
            message: `Category ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                category: {
                    _id: updatedCategory!._id,
                    name: updatedCategory!.name,
                    description: updatedCategory!.description,
                    slug: updatedCategory!.slug,
                    color: updatedCategory!.color,
                    isActive: updatedCategory!.isActive,
                    createdBy: updatedCategory!.createdBy,
                    createdAt: updatedCategory!.createdAt,
                    updatedAt: updatedCategory!.updatedAt,
                }
            },
        });
    }
}

export default new EventCategoryController();