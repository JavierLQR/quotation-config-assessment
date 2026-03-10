import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { ClientsService } from '../clients.service'
import { CLIENTS_REPOSITORY } from '../repositories'

const mockClient = {
  id: 1,
  name: 'KROWDY',
  clientTypeId: 1,
  basePrice: null,
  pricingStrategy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockClientsRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByClientTypeId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('ClientsService', () => {
  let service: ClientsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: CLIENTS_REPOSITORY, useValue: mockClientsRepository },
      ],
    }).compile()

    service = module.get<ClientsService>(ClientsService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return paginated clients with metadata', async () => {
      mockClientsRepository.findAll.mockResolvedValue({
        items: [mockClient],
        totalCount: 1,
      })

      const result = await service.findAll({ page: 1, perPage: 10 })

      expect(result.data).toEqual([mockClient])
      expect(result.message).toBe('Clients retrieved successfully')
      expect(result.success).toBe(true)
      expect(result.metadataPagination?.totalCount).toBe(1)
      expect(mockClientsRepository.findAll).toHaveBeenCalledWith(1, 10)
    })

    it('should return empty data when no clients exist', async () => {
      mockClientsRepository.findAll.mockResolvedValue({
        items: [],
        totalCount: 0,
      })

      const result = await service.findAll({ page: 1, perPage: 10 })

      expect(result.data).toEqual([])
      expect(result.metadataPagination?.totalCount).toBe(0)
    })
  })

  describe('findById', () => {
    it('should return a client when found', async () => {
      mockClientsRepository.findById.mockResolvedValue(mockClient)

      const result = await service.findById(1)

      expect(result.data).toEqual(mockClient)
      expect(result.message).toBe('Client retrieved successfully')
      expect(result.success).toBe(true)
    })

    it('should throw NotFoundException when client does not exist', async () => {
      mockClientsRepository.findById.mockResolvedValue(null)

      await expect(service.findById(99)).rejects.toThrow(NotFoundException)
      await expect(service.findById(99)).rejects.toThrow(
        'Client with id 99 not found',
      )
    })
  })

  describe('findByClientTypeId', () => {
    it('should return clients filtered by client type', async () => {
      mockClientsRepository.findByClientTypeId.mockResolvedValue([mockClient])

      const result = await service.findByClientTypeId(1)

      expect(result.data).toEqual([mockClient])
      expect(result.message).toBe('Clients retrieved successfully')
      expect(mockClientsRepository.findByClientTypeId).toHaveBeenCalledWith(1)
    })

    it('should return empty list when no clients match the type', async () => {
      mockClientsRepository.findByClientTypeId.mockResolvedValue([])

      const result = await service.findByClientTypeId(99)

      expect(result.data).toEqual([])
    })
  })

  describe('create', () => {
    const createInput = { name: 'KROWDY', clientTypeId: 1 }

    it('should create and return a client', async () => {
      mockClientsRepository.create.mockResolvedValue(mockClient)

      const result = await service.create(createInput)

      expect(result.data).toEqual(mockClient)
      expect(result.message).toBe('Client created successfully')
      expect(mockClientsRepository.create).toHaveBeenCalledWith({
        name: 'KROWDY',
        clientTypeId: 1,
        basePrice: undefined,
        pricingStrategy: undefined,
      })
    })
  })

  describe('update', () => {
    it('should update and return the client', async () => {
      const updated = { ...mockClient, name: 'KROWDY UPDATED' }
      mockClientsRepository.findById.mockResolvedValue(mockClient)
      mockClientsRepository.update.mockResolvedValue(updated)

      const result = await service.update({ id: 1, name: 'KROWDY UPDATED' })

      expect(result.data).toEqual(updated)
      expect(result.message).toBe('Client updated successfully')
      expect(mockClientsRepository.update).toHaveBeenCalledWith(1, {
        name: 'KROWDY UPDATED',
        basePrice: undefined,
        pricingStrategy: undefined,
      })
    })

    it('should throw NotFoundException when client does not exist', async () => {
      mockClientsRepository.findById.mockResolvedValue(null)

      await expect(service.update({ id: 99, name: 'X' })).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('should delete and return the client', async () => {
      mockClientsRepository.findById.mockResolvedValue(mockClient)
      mockClientsRepository.delete.mockResolvedValue(mockClient)

      const result = await service.remove(1)

      expect(result.data).toEqual(mockClient)
      expect(result.message).toBe('Client deleted successfully')
      expect(mockClientsRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException when client does not exist', async () => {
      mockClientsRepository.findById.mockResolvedValue(null)

      await expect(service.remove(99)).rejects.toThrow(NotFoundException)
    })
  })
})
