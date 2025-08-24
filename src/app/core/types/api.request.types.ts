import {APIRequestResources} from "../enums"

export type APIRequestResource =
    APIRequestResources.AuthenticationService |
    APIRequestResources.RouteService |
    APIRequestResources.EmployeeService |
    APIRequestResources.ProductService |
    APIRequestResources.CustomerService |
    APIRequestResources.OrderService |
    APIRequestResources.VariantService |
    APIRequestResources.PriceService |
    APIRequestResources.VariantStock |
    APIRequestResources.SalesPersonService |
    APIRequestResources.SalesPersonStockService |
    APIRequestResources.ApkService |
    APIRequestResources.ScreenSummaryService |
    APIRequestResources.PaymentTermsService |
    APIRequestResources.ReportsService


export type APIRequestMethod = 'delete' | 'get' | 'post' | 'put'

export type APIRequestCacheStrategy = 'performance' | 'freshness'
