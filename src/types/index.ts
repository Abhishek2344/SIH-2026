// ==============================================================================
// smart-Mandi — TypeScript Type Definitions
// ==============================================================================

export type UserRole =
  | 'farmer'
  | 'vendor'
  | 'centre_operator'
  | 'quality_inspector'
  | 'district_authority'
  | 'ministry_admin'
  | 'super_admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  mobileNumber: string;
  email: string;
  state: string;
  district: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Farmer {
  id: string;
  profileId: string;
  farmerId: string; // e.g., FMR-RJ-2026-1024
  village: string;
  address: string;
  landAreaAcres: number;
  landOwnershipStatus: 'Owned' | 'Leased' | 'Shared';
  preferredProcurementCentreId: string;
  
  // Verification placeholders
  aadhaarVerificationStatus: 'Verified' | 'Pending' | 'Rejected';
  mobileVerified: boolean;
  bankVerified: boolean;
  landVerified: boolean;
  bankAccountMask: string; // e.g. XXXX-XXXX-4819
  ifscCode: string;
  createdAt: string;
}

export type CropCategory = 'Cereal' | 'Pulse' | 'Oilseed' | 'Vegetable' | 'Cash Crop';

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  category: CropCategory;
  mspRate: number; // INR per quintal
  unit: string;
  qualityStandards?: {
    maxMoisturePct?: number;
    maxForeignMatterPct?: number;
    minTestWeight?: number;
    [key: string]: unknown;
  };
}

export type StockStatus =
  | 'Cultivated'
  | 'Harvested'
  | 'Stored'
  | 'Available for procurement'
  | 'Partially procured'
  | 'Fully procured';

export interface FarmerStock {
  id: string;
  farmerId: string;
  cropId: string;
  cropName: string;
  variety: string;
  cultivatedAreaAcres: number;
  expectedProductionQuintals: number;
  availableStockQuintals: number;
  harvestDate: string;
  storageLocation: string;
  expectedProcurementQuintals: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'FAQ (Fair Average Quality)';
  status: StockStatus;
  createdAt: string;
}

export interface Vendor {
  id: string;
  profileId: string;
  vendorCode: string; // VND-2026-081
  businessName: string;
  ownerName: string;
  businessType: 'Cooperative' | 'Private Miller' | 'Agro Processing' | 'Registered Trader';
  gstNumberMask: string;
  licenseNumber: string;
  verificationStatus: 'Pending' | 'Under Review' | 'Verified' | 'Suspended';
  state: string;
  district: string;
  commoditiesHandled: string[];
  storageCapacityMt: number;
  procurementCapacityMt: number;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
}

export interface ProcurementCentre {
  id: string;
  code: string; // RJ-JPR-PC-01
  name: string;
  state: string;
  district: string;
  mandiLocation: string;
  latitude: number;
  longitude: number;
  dailyFarmerCapacity: number;
  activeBays: number;
  operatingStatus: 'Operational' | 'Maintenance' | 'Suspended';
  centreManagerName: string;
  contactNumber: string;
  // Computed live metrics
  todayBookingsCount?: number;
  todayArrivedCount?: number;
  todayCompletedCount?: number;
  avgWaitMinutes?: number;
}

export interface CentreSlot {
  id: string;
  centreId: string;
  slotDate: string;
  timeWindow: string; // e.g. "09:00 - 10:00 AM"
  capacity: number;
  bookedCount: number;
}

export type BookingStatus = 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled' | 'No-Show';

export interface SlotBooking {
  id: string;
  bookingReference: string; // SB-2026-9812
  farmerId: string;
  farmerName?: string;
  centreId: string;
  centreName?: string;
  slotId: string;
  cropId: string;
  cropName?: string;
  slotDate: string;
  timeWindow: string;
  declaredQuantityQuintals: number;
  bookingStatus: BookingStatus;
  tokenNumber?: string;
  createdAt: string;
}

export type QueueTokenStatus = 'WAITING' | 'CALLED' | 'IN_VERIFICATION' | 'WEIGHING' | 'COMPLETED' | 'SKIPPED';

export interface QueueToken {
  id: string;
  tokenNumber: string; // e.g. A-124
  bookingId: string;
  centreId: string;
  farmerId: string;
  farmerName?: string;
  cropName?: string;
  quantityQuintals?: number;
  queueDate: string;
  sequenceOrder: number;
  status: QueueTokenStatus;
  calledAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  createdAt: string;
}

export type PaymentStatus = 'Pending' | 'Initiated' | 'Processing' | 'Credited' | 'Failed' | 'Under Review';

export interface ProcurementTransaction {
  id: string;
  transactionId: string; // e.g., TXN-2026-00124
  bookingId: string;
  tokenId: string;
  farmerId: string;
  farmerName: string;
  farmerCode: string; // e.g., FMR-1024
  centreId: string;
  centreName: string;
  cropId: string;
  cropName: string;
  quantityQuintals: number;
  mspRate: number;
  actualRate: number;
  grossAmount: number;
  
  // Anti-intermediary transparency
  authorisedCharges: number; // 0.00
  unauthorisedCharges: number; // strictly 0.00
  netPayableAmount: number;
  
  qualityGrade: string;
  moisturePercentage: number;
  foreignMatterPercentage: number;
  
  grossWeightKg?: number;
  tareWeightKg?: number;
  netWeightKg?: number;
  
  paymentStatus: PaymentStatus;
  digitalReceiptHash: string;
  verificationCode: string; // e.g., AS-VFY-2026-99128
  dbtReferenceUtr?: string;
  bankAccountMask?: string;
  timestamp: string;
}

export interface CommodityPrice {
  id: string;
  commodity: string;
  state: string;
  district: string;
  mandiName: string;
  farmGatePrice: number; // INR per kg
  wholesalePrice: number;
  retailPrice: number;
  spread: number; // retail - farmGate
  dailyArrivalQuintals: number;
  sourceAgency: string;
  reportedDate: string;
  change24h?: number;
  change7d?: number;
  change30d?: number;
}

export interface GovernmentStock {
  id: string;
  commodity: string;
  warehouseName: string;
  state: string;
  district: string;
  currentStockMt: number;
  capacityMt: number;
  utilizationPct: number;
  averageStockAgeDays: number;
  conditionRating: 'Optimal' | 'Fair' | 'Quality Warning' | 'Ageing Alert';
  updatedAt: string;
}

export type AlertSeverity = 'Low' | 'Medium' | 'High Alert';

export interface PriceAlert {
  id: string;
  commodity: string;
  district: string;
  alertType: 'Price Spike' | 'Abnormal Price Spread' | 'Supply Stress Watch' | 'Arrival Deficit';
  severity: AlertSeverity;
  currentPrice: number;
  benchmarkPrice: number;
  percentageDeviation: number;
  anomalyReason: string;
  status: 'Flagged for Review' | 'Investigating' | 'Closed';
  createdAt: string;
}

export type ComplaintCategory =
  | 'Extra Charges Demanded'
  | 'Delayed Payment'
  | 'Incorrect Quantity'
  | 'Incorrect Price'
  | 'Quality Dispute'
  | 'Vendor Misconduct'
  | 'Centre Congestion / Operator Issue'
  | 'Other';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Investigation' | 'Resolved' | 'Rejected with Reason';

export interface Complaint {
  id: string;
  complaintCode: string; // e.g. CMP-2026-4410
  farmerId: string;
  farmerName: string;
  transactionId?: string;
  category: ComplaintCategory;
  description: string;
  evidenceUrl?: string;
  status: ComplaintStatus;
  assignedOfficer?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  actionType:
    | 'PRICE_UPDATED'
    | 'TRANSACTION_MODIFIED'
    | 'STOCK_UPDATED'
    | 'PAYMENT_STATUS_UPDATED'
    | 'COMPLAINT_RESOLVED'
    | 'VENDOR_VERIFIED'
    | 'QUEUE_ADVANCED'
    | 'SLOT_BOOKED'
    | 'PROCUREMENT_COMPLETED';
  recordId: string;
  tableName: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'Procurement' | 'Queue' | 'Slot' | 'Payment' | 'Price' | 'Alert' | 'Grievance';
  read: boolean;
  deliveryStatus: 'In-App Sent' | 'SMS Mock Sent';
  createdAt: string;
}

export interface VendorRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  cropId: string;
  cropName: string;
  district: string;
  targetQuantityQuintals: number;
  offeredRateQuintal: number;
  status: 'Active' | 'Under Review' | 'Matched' | 'Fulfilled';
  createdAt: string;
}

export interface AggregatedMarketStock {
  cropName: string;
  district: string;
  state: string;
  totalAggregatedQuintals: number;
  participatingFarmersCount: number;
  avgQuantityPerFarmer: number;
  averageMspRate: number;
  marketRatePerQuintal: number;
}
