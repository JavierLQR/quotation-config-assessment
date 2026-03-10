import { Test, TestingModule } from '@nestjs/testing'

import { ClientTypesResolver } from '../client-types.resolver'
import { ClientTypesService } from '../client-types.service'

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

const mockClientType = {
  id: 1,
  name: 'Tipo A',
  basePrice: 250,
  pricingStrategy: 'POR_ESTRUCTURA',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockClientTypesService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('ClientTypesResolver', () => {
  let resolver: ClientTypesResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientTypesResolver,
        { provide: ClientTypesService, useValue: mockClientTypesService },
      ],
    }).compile()

    resolver = module.get<ClientTypesResolver>(ClientTypesResolver)
    jest.clearAllMocks()
  })

  describe('findAllClientTypes', () => {
    it('should call service.findAll with pagination args and return result', async () => {
      const pagination = { page: 1, perPage: 10 }
      const payload = mockPaginatedPayload([mockClientType])
      mockClientTypesService.findAll.mockResolvedValue(payload)

      const result = await resolver.findAllClientTypes(pagination)

      expect(result).toEqual(payload)
      expect(mockClientTypesService.findAll).toHaveBeenCalledWith(pagination)
    })
  })

  describe('findOneClientType', () => {
    it('should call service.findById with the given id and return result', async () => {
      const payload = mockPayload(
        mockClientType,
        'Client type retrieved successfully',
      )
      mockClientTypesService.findById.mockResolvedValue(payload)

      const result = await resolver.findOneClientType(1)

      expect(result).toEqual(payload)
      expect(mockClientTypesService.findById).toHaveBeenCalledWith(1)
    })
  })

  describe('createClientType', () => {
    it('should call service.create with input and return result', async () => {
      const input = {
        name: 'Tipo A',
        basePrice: 250,
        pricingStrategy: 'POR_ESTRUCTURA',
      }
      const payload = mockPayload(
        mockClientType,
        'Client type created successfully',
      )
      mockClientTypesService.create.mockResolvedValue(payload)

      const result = await resolver.createClientType(input)

      expect(result).toEqual(payload)
      expect(mockClientTypesService.create).toHaveBeenCalledWith(input)
    })
  })

  describe('updateClientType', () => {
    it('should call service.update with input and return result', async () => {
      const input = { id: 1, basePrice: 300 }
      const payload = mockPayload(
        { ...mockClientType, basePrice: 300 },
        'Client type updated successfully',
      )
      mockClientTypesService.update.mockResolvedValue(payload)

      const result = await resolver.updateClientType(input)

      expect(result).toEqual(payload)
      expect(mockClientTypesService.update).toHaveBeenCalledWith(input)
    })
  })

  describe('removeClientType', () => {
    it('should call service.remove with id and return result', async () => {
      const payload = mockPayload(
        mockClientType,
        'Client type deleted successfully',
      )
      mockClientTypesService.remove.mockResolvedValue(payload)

      const result = await resolver.removeClientType(1)

      expect(result).toEqual(payload)
      expect(mockClientTypesService.remove).toHaveBeenCalledWith(1)
    })
  })
})
