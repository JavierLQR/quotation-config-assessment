import { Test, TestingModule } from '@nestjs/testing'

import { PlantsResolver } from '../plants.resolver'
import { PlantsService } from '../plants.service'

const mockPayload = (data: unknown, message = 'ok') => ({
  data,
  message,
  status: 'success',
  success: true,
})

const mockPaginatedPayload = (data: unknown) => ({
  ...mockPayload(data),
  metadataPagination: {
    totalCount: 1,
    pageCount: 1,
    currentPage: 1,
    perPage: 10,
    isFirstPage: true,
    isLastPage: true,
    previousPage: null,
    nextPage: null,
  },
})

const mockPlant = {
  id: 1,
  name: 'Planta Lima',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPlantsService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('PlantsResolver', () => {
  let resolver: PlantsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantsResolver,
        { provide: PlantsService, useValue: mockPlantsService },
      ],
    }).compile()

    resolver = module.get<PlantsResolver>(PlantsResolver)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should call service.findAll with pagination args and return result', async () => {
      const pagination = { page: 1, perPage: 10 }
      const payload = mockPaginatedPayload([mockPlant])
      mockPlantsService.findAll.mockResolvedValue(payload)

      const result = await resolver.findAll(pagination)

      expect(result).toEqual(payload)
      expect(mockPlantsService.findAll).toHaveBeenCalledWith(pagination)
    })
  })

  describe('findOne', () => {
    it('should call service.findById with the given id and return result', async () => {
      const payload = mockPayload(mockPlant, 'Plant retrieved successfully')
      mockPlantsService.findById.mockResolvedValue(payload)

      const result = await resolver.findOne(1)

      expect(result).toEqual(payload)
      expect(mockPlantsService.findById).toHaveBeenCalledWith(1)
    })
  })

  describe('createPlant', () => {
    it('should call service.create with input and return result', async () => {
      const input = { name: 'Planta Lima' }
      const payload = mockPayload(mockPlant, 'Plant created successfully')
      mockPlantsService.create.mockResolvedValue(payload)

      const result = await resolver.createPlant(input)

      expect(result).toEqual(payload)
      expect(mockPlantsService.create).toHaveBeenCalledWith(input)
    })
  })

  describe('updatePlant', () => {
    it('should call service.update with input and return result', async () => {
      const input = { id: 1, name: 'Planta Arequipa' }
      const payload = mockPayload(
        { ...mockPlant, name: 'Planta Arequipa' },
        'Plant updated successfully',
      )
      mockPlantsService.update.mockResolvedValue(payload)

      const result = await resolver.updatePlant(input)

      expect(result).toEqual(payload)
      expect(mockPlantsService.update).toHaveBeenCalledWith(input)
    })
  })

  describe('removePlant', () => {
    it('should call service.remove with id and return result', async () => {
      const payload = mockPayload(mockPlant, 'Plant deleted successfully')
      mockPlantsService.remove.mockResolvedValue(payload)

      const result = await resolver.removePlant(1)

      expect(result).toEqual(payload)
      expect(mockPlantsService.remove).toHaveBeenCalledWith(1)
    })
  })
})
