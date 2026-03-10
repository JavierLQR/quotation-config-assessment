import { Test, TestingModule } from '@nestjs/testing'

import { MarginConfigsResolver } from '../margin-configs.resolver'
import { MarginConfigsService } from '../margin-configs.service'

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

const mockMarginConfigsService = {
  findByPlantId: jest.fn(),
  findByPlantAndClientType: jest.fn(),
  findByPlantAndClient: jest.fn(),
  upsert: jest.fn(),
  savePlantConfig: jest.fn(),
  remove: jest.fn(),
}

describe('MarginConfigsResolver', () => {
  let resolver: MarginConfigsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarginConfigsResolver,
        { provide: MarginConfigsService, useValue: mockMarginConfigsService },
      ],
    }).compile()

    resolver = module.get<MarginConfigsResolver>(MarginConfigsResolver)
    jest.clearAllMocks()
  })

  describe('findByPlant', () => {
    it('should call service.findByPlantId with plantId and pagination and return result', async () => {
      const pagination = { page: 1, perPage: 10 }
      const payload = mockPaginatedPayload([mockMarginConfig])
      mockMarginConfigsService.findByPlantId.mockResolvedValue(payload)

      const result = await resolver.findByPlant(1, pagination)

      expect(result).toEqual(payload)
      expect(mockMarginConfigsService.findByPlantId).toHaveBeenCalledWith(
        1,
        pagination,
      )
    })
  })

  describe('findByPlantAndClientType', () => {
    it('should call service.findByPlantAndClientType and return result', async () => {
      const payload = mockPayload(
        [mockMarginConfig],
        'Margin configs retrieved successfully',
      )
      mockMarginConfigsService.findByPlantAndClientType.mockResolvedValue(
        payload,
      )

      const result = await resolver.findByPlantAndClientType(1, 1)

      expect(result).toEqual(payload)
      expect(
        mockMarginConfigsService.findByPlantAndClientType,
      ).toHaveBeenCalledWith(1, 1)
    })
  })

  describe('findByPlantAndClient', () => {
    it('should call service.findByPlantAndClient and return result', async () => {
      const payload = mockPayload(
        [mockMarginConfig],
        'Margin configs retrieved successfully',
      )
      mockMarginConfigsService.findByPlantAndClient.mockResolvedValue(payload)

      const result = await resolver.findByPlantAndClient(1, 1)

      expect(result).toEqual(payload)
      expect(
        mockMarginConfigsService.findByPlantAndClient,
      ).toHaveBeenCalledWith(1, 1)
    })
  })

  describe('upsertMargin', () => {
    it('should call service.upsert with input and return result', async () => {
      const input = {
        plantId: 1,
        clientTypeId: 1,
        volumeRange: 'KG_300' as const,
        margin: 10.5,
      }
      const payload = mockPayload(
        mockMarginConfig,
        'Margin config saved successfully',
      )
      mockMarginConfigsService.upsert.mockResolvedValue(payload)

      const result = await resolver.upsertMargin(input)

      expect(result).toEqual(payload)
      expect(mockMarginConfigsService.upsert).toHaveBeenCalledWith(input)
    })
  })

  describe('savePlantConfig', () => {
    it('should call service.savePlantConfig with input and return count', async () => {
      const input = {
        plantId: 1,
        margins: [
          { volumeRange: 'KG_300' as const, margin: 10 },
          { volumeRange: 'T_1' as const, margin: 5 },
        ],
      }
      const payload = mockPayload(2, 'Plant config saved successfully')
      mockMarginConfigsService.savePlantConfig.mockResolvedValue(payload)

      const result = await resolver.savePlantConfig(input)

      expect(result).toEqual(payload)
      expect(mockMarginConfigsService.savePlantConfig).toHaveBeenCalledWith(
        input,
      )
    })
  })

  describe('removeMargin', () => {
    it('should call service.remove with id and return result', async () => {
      const payload = mockPayload(
        mockMarginConfig,
        'Margin config deleted successfully',
      )
      mockMarginConfigsService.remove.mockResolvedValue(payload)

      const result = await resolver.removeMargin(1)

      expect(result).toEqual(payload)
      expect(mockMarginConfigsService.remove).toHaveBeenCalledWith(1)
    })
  })
})
