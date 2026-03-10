import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'

import { ClientTypesService } from '../client-types.service'
import { CLIENT_TYPES_REPOSITORY } from '../repositories'

const mockClientType = {
  id: 1,
  name: 'Tipo A',
  basePrice: 250,
  pricingStrategy: 'POR_ESTRUCTURA',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockClientTypesRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  findByIdWithClients: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('ClientTypesService', () => {
  let service: ClientTypesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientTypesService,
        {
          provide: CLIENT_TYPES_REPOSITORY,
          useValue: mockClientTypesRepository,
        },
      ],
    }).compile()

    service = module.get<ClientTypesService>(ClientTypesService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return paginated client types with metadata', async () => {
      mockClientTypesRepository.findAll.mockResolvedValue({
        items: [mockClientType],
        totalCount: 1,
      })

      const result = await service.findAll({ page: 1, perPage: 10 })

      expect(result.data).toEqual([mockClientType])
      expect(result.message).toBe('Client types retrieved successfully')
      expect(result.success).toBe(true)
      expect(result.metadataPagination?.totalCount).toBe(1)
      expect(mockClientTypesRepository.findAll).toHaveBeenCalledWith(1, 10)
    })

    it('should return empty data when no client types exist', async () => {
      mockClientTypesRepository.findAll.mockResolvedValue({
        items: [],
        totalCount: 0,
      })

      const result = await service.findAll({ page: 1, perPage: 10 })

      expect(result.data).toEqual([])
      expect(result.metadataPagination?.totalCount).toBe(0)
    })
  })

  describe('findById', () => {
    it('should return a client type when found', async () => {
      mockClientTypesRepository.findById.mockResolvedValue(mockClientType)

      const result = await service.findById(1)

      expect(result.data).toEqual(mockClientType)
      expect(result.message).toBe('Client type retrieved successfully')
      expect(result.success).toBe(true)
    })

    it('should throw NotFoundException when client type does not exist', async () => {
      mockClientTypesRepository.findById.mockResolvedValue(null)

      await expect(service.findById(99)).rejects.toThrow(NotFoundException)
      await expect(service.findById(99)).rejects.toThrow(
        'ClientType with id 99 not found',
      )
    })
  })

  describe('create', () => {
    const createInput = {
      name: 'Tipo A',
      basePrice: 250,
      pricingStrategy: 'POR_ESTRUCTURA',
    }

    it('should create and return a client type', async () => {
      mockClientTypesRepository.findByName.mockResolvedValue(null)
      mockClientTypesRepository.create.mockResolvedValue(mockClientType)

      const result = await service.create(createInput)

      expect(result.data).toEqual(mockClientType)
      expect(result.message).toBe('Client type created successfully')
      expect(mockClientTypesRepository.create).toHaveBeenCalledWith(createInput)
    })

    it('should throw BadRequestException when name already exists', async () => {
      mockClientTypesRepository.findByName.mockResolvedValue(mockClientType)

      await expect(service.create(createInput)).rejects.toThrow(
        BadRequestException,
      )
      await expect(service.create(createInput)).rejects.toThrow(
        'ClientType with name "Tipo A" already exists',
      )
      expect(mockClientTypesRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update and return the client type', async () => {
      const updated = { ...mockClientType, basePrice: 300 }
      mockClientTypesRepository.findById.mockResolvedValue(mockClientType)
      mockClientTypesRepository.update.mockResolvedValue(updated)

      const result = await service.update({ id: 1, basePrice: 300 })

      expect(result.data).toEqual(updated)
      expect(result.message).toBe('Client type updated successfully')
      expect(mockClientTypesRepository.update).toHaveBeenCalledWith(1, {
        name: undefined,
        basePrice: 300,
        pricingStrategy: undefined,
      })
    })

    it('should throw NotFoundException when client type does not exist', async () => {
      mockClientTypesRepository.findById.mockResolvedValue(null)

      await expect(service.update({ id: 99 })).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('should delete and return the client type', async () => {
      mockClientTypesRepository.findById.mockResolvedValue(mockClientType)
      mockClientTypesRepository.delete.mockResolvedValue(mockClientType)

      const result = await service.remove(1)

      expect(result.data).toEqual(mockClientType)
      expect(result.message).toBe('Client type deleted successfully')
      expect(mockClientTypesRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException when client type does not exist', async () => {
      mockClientTypesRepository.findById.mockResolvedValue(null)

      await expect(service.remove(99)).rejects.toThrow(NotFoundException)
    })
  })
})
