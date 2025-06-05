import http from '@/lib/http'
import { CreatePackageType, PackageResType, UpdatePackageType } from '@/schema/package.schema'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/packages'

const packageServ = {
  getAllPackages: () => {
    return http.get<ApiResponseType>(`${prefix}/get-all-packages`)
  },
  getPackageById: (packageId: number) => {
    return http.get<PackageResType>(`${prefix}/get-package-by-id/${packageId}`)
  },
  createPackage: (data: CreatePackageType) => {
    return http.post<ApiResponseType>(`${prefix}/create-package`, data)
  },
  updatePackage: (data: UpdatePackageType, packageId: number) => {
    return http.put<PackageResType>(`${prefix}/update-package/${packageId}`, data)
  },
  deletePackage: (packageId: number) => {
    return http.delete<ApiResponseType>(`${prefix}/delete-package/${packageId}`, null)
  }
}

export default packageServ
