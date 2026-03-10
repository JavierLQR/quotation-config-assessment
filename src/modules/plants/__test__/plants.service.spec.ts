import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'

import { PlantsService } from '../plants.service'
import { PLANTS_REPOSITORY } from '../repositories'

const mockPlant = {
  id: 1,
  name: 'Planta Lima',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPlantsRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('PlantsService', () => {
  let service: PlantsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantsService,
        { provide: PLANTS_REPOSITORY, useValue: mockPlantsRepository },
      ],
    }).compile()

    service = module.get<PlantsService>(PlantsService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return paginated plants with metadata', async () => {
      mockPlantsRepository.findAll.mockResolvedValue({
        items: [mockPlant],
        totalCount: 1,
      })

      const result = await service.findAll({ page: 1, perPage: 10 })

      expect(result.data).toEqual([mockPlant])
      expect(result.message).toBe('Plants retrieved successfully')
      expect(result.success).toBe(true)
      expect(result.metadataPagination).toBeDefined()
      expect(result.metadataPagination?.totalCount).toBe(1)
      expect(mockPlantsRepository.findAll).toHaveBeenCalledWith(1, 10)
    })

    it('should return empty data when no plants exist', async () => {
      mockPlantsRepository.findAll.mockResolvedValue({
        items: [],
        totalCount: 0,
      })

      const result = await service.findAll({ page: 1, perPage: 10 })

      expect(result.data).toEqual([])
      expect(result.metadataPagination?.totalCount).toBe(0)
    })
  })

  describe('findById', () => {
    it('should return a plant when found', async () => {
      mockPlantsRepository.findById.mockResolvedValue(mockPlant)

      const result = await service.findById(1)

      expect(result.data).toEqual(mockPlant)
      expect(result.message).toBe('Plant retrieved successfully')
      expect(result.success).toBe(true)
    })

    it('should throw NotFoundException when plant does not exist', async () => {
      mockPlantsRepository.findById.mockResolvedValue(null)

      await expect(service.findById(99)).rejects.toThrow(NotFoundException)
      await expect(service.findById(99)).rejects.toThrow(
        'Plant with id 99 not found',
      )
    })
  })

  describe('create', () => {
    it('should create and return a plant', async () => {
      mockPlantsRepository.findByName.mockResolvedValue(null)
      mockPlantsRepository.create.mockResolvedValue(mockPlant)

      const result = await service.create({ name: 'Planta Lima' })

      expect(result.data).toEqual(mockPlant)
      expect(result.message).toBe('Plant created successfully')
      expect(mockPlantsRepository.create).toHaveBeenCalledWith({
        name: 'Planta Lima',
      })
    })

    it('should throw BadRequestException when plant name already exists', async () => {
      mockPlantsRepository.findByName.mockResolvedValue(mockPlant)

      await expect(service.create({ name: 'Planta Lima' })).rejects.toThrow(
        BadRequestException,
      )
      await expect(service.create({ name: 'Planta Lima' })).rejects.toThrow(
        'Plant with name "Planta Lima" already exists',
      )
      expect(mockPlantsRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update and return the plant', async () => {
      const updated = { ...mockPlant, name: 'Planta Arequipa' }
      mockPlantsRepository.findById.mockResolvedValue(mockPlant)
      mockPlantsRepository.update.mockResolvedValue(updated)

      const result = await service.update({ id: 1, name: 'Planta Arequipa' })

      expect(result.data).toEqual(updated)
      expect(result.message).toBe('Plant updated successfully')
      expect(mockPlantsRepository.update).toHaveBeenCalledWith(1, {
        name: 'Planta Arequipa',
      })
    })

    it('should throw NotFoundException when plant does not exist', async () => {
      mockPlantsRepository.findById.mockResolvedValue(null)

      await expect(service.update({ id: 99, name: 'X' })).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('should delete and return the plant', async () => {
      mockPlantsRepository.findById.mockResolvedValue(mockPlant)
      mockPlantsRepository.delete.mockResolvedValue(mockPlant)

      const result = await service.remove(1)

      expect(result.data).toEqual(mockPlant)
      expect(result.message).toBe('Plant deleted successfully')
      expect(mockPlantsRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException when plant does not exist', async () => {
      mockPlantsRepository.findById.mockResolvedValue(null)

      await expect(service.remove(99)).rejects.toThrow(NotFoundException)
    })
  })
})
