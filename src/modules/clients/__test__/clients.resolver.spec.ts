import { Test, TestingModule } from '@nestjs/testing'

import { ClientsResolver } from '../clients.resolver'
import { ClientsService } from '../clients.service'

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

const mockClient = {
  id: 1,
  name: 'KROWDY',
  clientTypeId: 1,
  basePrice: null,
  pricingStrategy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockClientsService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByClientTypeId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('ClientsResolver', () => {
  let resolver: ClientsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsResolver,
        { provide: ClientsService, useValue: mockClientsService },
      ],
    }).compile()

    resolver = module.get<ClientsResolver>(ClientsResolver)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should call service.findAll with pagination args and return result', async () => {
      const pagination = { page: 1, perPage: 10 }
      const payload = mockPaginatedPayload([mockClient])
      mockClientsService.findAll.mockResolvedValue(payload)

      const result = await resolver.findAll(pagination)

      expect(result).toEqual(payload)
      expect(mockClientsService.findAll).toHaveBeenCalledWith(pagination)
    })
  })

  describe('findOne', () => {
    it('should call service.findById with the given id and return result', async () => {
      const payload = mockPayload(mockClient, 'Client retrieved successfully')
      mockClientsService.findById.mockResolvedValue(payload)

      const result = await resolver.findOne(1)

      expect(result).toEqual(payload)
      expect(mockClientsService.findById).toHaveBeenCalledWith(1)
    })
  })

  describe('findByType', () => {
    it('should call service.findByClientTypeId and return result', async () => {
      const payload = mockPayload(
        [mockClient],
        'Clients retrieved successfully',
      )
      mockClientsService.findByClientTypeId.mockResolvedValue(payload)

      const result = await resolver.findByType(1)

      expect(result).toEqual(payload)
      expect(mockClientsService.findByClientTypeId).toHaveBeenCalledWith(1)
    })
  })

  describe('createClient', () => {
    it('should call service.create with input and return result', async () => {
      const input = { name: 'KROWDY', clientTypeId: 1 }
      const payload = mockPayload(mockClient, 'Client created successfully')
      mockClientsService.create.mockResolvedValue(payload)

      const result = await resolver.createClient(input)

      expect(result).toEqual(payload)
      expect(mockClientsService.create).toHaveBeenCalledWith(input)
    })
  })

  describe('updateClient', () => {
    it('should call service.update with input and return result', async () => {
      const input = { id: 1, name: 'KROWDY UPDATED' }
      const payload = mockPayload(
        { ...mockClient, name: 'KROWDY UPDATED' },
        'Client updated successfully',
      )
      mockClientsService.update.mockResolvedValue(payload)

      const result = await resolver.updateClient(input)

      expect(result).toEqual(payload)
      expect(mockClientsService.update).toHaveBeenCalledWith(input)
    })
  })

  describe('removeClient', () => {
    it('should call service.remove with id and return result', async () => {
      const payload = mockPayload(mockClient, 'Client deleted successfully')
      mockClientsService.remove.mockResolvedValue(payload)

      const result = await resolver.removeClient(1)

      expect(result).toEqual(payload)
      expect(mockClientsService.remove).toHaveBeenCalledWith(1)
    })
  })
})
