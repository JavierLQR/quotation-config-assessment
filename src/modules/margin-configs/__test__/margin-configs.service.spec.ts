import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { MarginConfigsService } from '../margin-configs.service'
import { MARGIN_CONFIGS_REPOSITORY } from '../repositories'

const mockMarginConfig = {
  id: 1,
  plantId: 1,
  clientTypeId: 1,
  clientId: null,
  volumeRange: 'KG_300',
  margin: 10.5,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockMarginConfigsRepository = {
  findById: jest.fn(),
  findByPlantId: jest.fn(),
  findByPlantAndClientType: jest.fn(),
  findByPlantAndClient: jest.fn(),
  upsert: jest.fn(),
  upsertMany: jest.fn(),
  delete: jest.fn(),
}

describe('MarginConfigsService', () => {
  let service: MarginConfigsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarginConfigsService,
        {
          provide: MARGIN_CONFIGS_REPOSITORY,
          useValue: mockMarginConfigsRepository,
        },
      ],
    }).compile()

    service = module.get<MarginConfigsService>(MarginConfigsService)
    jest.clearAllMocks()
  })

  describe('findByPlantId', () => {
    it('should return paginated margin configs for a plant', async () => {
      mockMarginConfigsRepository.findByPlantId.mockResolvedValue({
        items: [mockMarginConfig],
        totalCount: 1,
      })

      const result = await service.findByPlantId(1, { page: 1, perPage: 10 })

      expect(result.data).toEqual([mockMarginConfig])
      expect(result.message).toBe('Margin configs retrieved successfully')
      expect(result.success).toBe(true)
      expect(result.metadataPagination?.totalCount).toBe(1)
      expect(mockMarginConfigsRepository.findByPlantId).toHaveBeenCalledWith(
        1,
        1,
        10,
      )
    })

    it('should return empty list when no configs exist for that plant', async () => {
      mockMarginConfigsRepository.findByPlantId.mockResolvedValue({
        items: [],
        totalCount: 0,
      })

      const result = await service.findByPlantId(99, { page: 1, perPage: 10 })

      expect(result.data).toEqual([])
      expect(result.metadataPagination?.totalCount).toBe(0)
    })
  })

  describe('findByPlantAndClientType', () => {
    it('should return margin configs filtered by plant and client type', async () => {
      mockMarginConfigsRepository.findByPlantAndClientType.mockResolvedValue([
        mockMarginConfig,
      ])

      const result = await service.findByPlantAndClientType(1, 1)

      expect(result.data).toEqual([mockMarginConfig])
      expect(result.message).toBe('Margin configs retrieved successfully')
      expect(
        mockMarginConfigsRepository.findByPlantAndClientType,
      ).toHaveBeenCalledWith(1, 1)
    })

    it('should return empty list when no configs match', async () => {
      mockMarginConfigsRepository.findByPlantAndClientType.mockResolvedValue([])

      const result = await service.findByPlantAndClientType(1, 99)

      expect(result.data).toEqual([])
    })
  })

  describe('findByPlantAndClient', () => {
    it('should return margin configs filtered by plant and client', async () => {
      mockMarginConfigsRepository.findByPlantAndClient.mockResolvedValue([
        mockMarginConfig,
      ])

      const result = await service.findByPlantAndClient(1, 1)

      expect(result.data).toEqual([mockMarginConfig])
      expect(result.message).toBe('Margin configs retrieved successfully')
      expect(
        mockMarginConfigsRepository.findByPlantAndClient,
      ).toHaveBeenCalledWith(1, 1)
    })
  })

  describe('upsert', () => {
    const upsertInput = {
      plantId: 1,
      clientTypeId: 1,
      volumeRange: 'KG_300' as const,
      margin: 10.5,
    }

    it('should upsert and return the margin config', async () => {
      mockMarginConfigsRepository.upsert.mockResolvedValue(mockMarginConfig)

      const result = await service.upsert(upsertInput)

      expect(result.data).toEqual(mockMarginConfig)
      expect(result.message).toBe('Margin config saved successfully')
      expect(result.success).toBe(true)
      expect(mockMarginConfigsRepository.upsert).toHaveBeenCalledWith(
        upsertInput,
      )
    })
  })

  describe('savePlantConfig', () => {
    it('should save multiple margin entries and return the count', async () => {
      mockMarginConfigsRepository.upsertMany.mockResolvedValue(3)

      const result = await service.savePlantConfig({
        plantId: 1,
        margins: [
          { volumeRange: 'KG_300' as const, margin: 10 },
          { volumeRange: 'KG_500' as const, margin: 12 },
          { volumeRange: 'T_1' as const, margin: 8 },
        ],
      })

      expect(result.data).toBe(3)
      expect(result.message).toBe('Plant config saved successfully')
      expect(mockMarginConfigsRepository.upsertMany).toHaveBeenCalledWith(
        1,
        expect.any(Array),
      )
    })
  })

  describe('remove', () => {
    it('should delete and return the margin config', async () => {
      mockMarginConfigsRepository.findById.mockResolvedValue(mockMarginConfig)
      mockMarginConfigsRepository.delete.mockResolvedValue(mockMarginConfig)

      const result = await service.remove(1)

      expect(result.data).toEqual(mockMarginConfig)
      expect(result.message).toBe('Margin config deleted successfully')
      expect(mockMarginConfigsRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException when margin config does not exist', async () => {
      mockMarginConfigsRepository.findById.mockResolvedValue(null)

      await expect(service.remove(99)).rejects.toThrow(NotFoundException)
      await expect(service.remove(99)).rejects.toThrow(
        'MarginConfig with id 99 not found',
      )
    })
  })
})
