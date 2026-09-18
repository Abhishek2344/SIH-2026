import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Farmer,
  Crop,
  FarmerStock,
  Vendor,
  ProcurementCentre,
  CentreSlot,
  SlotBooking,
  QueueToken,
  QueueTokenStatus,
  ProcurementTransaction,
  CommodityPrice,
  GovernmentStock,
  PriceAlert,
  Complaint,
  AuditLog,
  NotificationItem,
  VendorRequest,
  AggregatedMarketStock,
} from '../types';
import {
  DEMO_PROFILES,
  INITIAL_FARMERS,
  INITIAL_CROPS,
  INITIAL_STOCKS,
  INITIAL_CENTRES,
  INITIAL_SLOTS,
  INITIAL_BOOKINGS,
  INITIAL_TOKENS,
  INITIAL_TRANSACTIONS,
  INITIAL_VENDORS,
  INITIAL_AGGREGATED_STOCKS,
  INITIAL_PRICES,
  INITIAL_GOV_STOCKS,
  INITIAL_ALERTS,
  INITIAL_COMPLAINTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_VENDOR_REQUESTS,
} from '../services/mockData';

interface AppContextType {
  // Current session
  currentUser: UserProfile;
  currentRole: UserRole;
  currentFarmer?: Farmer;
  currentVendor?: Vendor;
  isAuthenticated: boolean;
  
  // Auth & Session methods
  switchUserRole: (role: UserRole) => void;
  loginWithOtp: (mobile: string, otp: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  completeFarmerProfile: (data: Partial<Farmer>) => void;
  completeVendorProfile: (data: Partial<Vendor>) => void;

  // Domain data
  farmers: Farmer[];
  crops: Crop[];
  stocks: FarmerStock[];
  centres: ProcurementCentre[];
  slots: CentreSlot[];
  bookings: SlotBooking[];
  tokens: QueueToken[];
  transactions: ProcurementTransaction[];
  vendors: Vendor[];
  aggregatedStocks: AggregatedMarketStock[];
  prices: CommodityPrice[];
  govStocks: GovernmentStock[];
  alerts: PriceAlert[];
  complaints: Complaint[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  vendorRequests: VendorRequest[];

  // Operational Actions
  bookSlot: (params: {
    farmerId: string;
    centreId: string;
    cropId: string;
    slotDate: string;
    timeWindow: string;
    quantity: number;
  }) => SlotBooking;

  advanceQueueToken: (
    tokenId: string,
    newStatus: QueueTokenStatus
  ) => void;

  completeProcurement: (params: {
    bookingId: string;
    tokenId: string;
    farmerId: string;
    centreId: string;
    cropId: string;
    quantityQuintals: number;
    mspRate: number;
    qualityGrade: string;
    moisturePct: number;
    foreignMatterPct: number;
    grossWeightKg: number;
    tareWeightKg: number;
  }) => ProcurementTransaction;

  addFarmerStock: (stock: Omit<FarmerStock, 'id' | 'createdAt'>) => void;
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'complaintCode' | 'createdAt'>) => Complaint;
  resolveComplaint: (complaintId: string, status: Complaint['status'], notes: string) => void;
  sendVendorInterest: (req: Omit<VendorRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateCommodityPrice: (id: string, newRetailPrice: number, newWholesalePrice?: number) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // SIH Benchmark Demo Flow
  executeRameshDemoScenario: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage initialization for persistent prototype demo
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`annadata_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    loadInitial('currentUser', DEMO_PROFILES[0])
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [farmers, setFarmers] = useState<Farmer[]>(() => loadInitial('farmers', INITIAL_FARMERS));
  const [crops] = useState<Crop[]>(INITIAL_CROPS);
  const [stocks, setStocks] = useState<FarmerStock[]>(() => loadInitial('stocks', INITIAL_STOCKS));
  const [centres, setCentres] = useState<ProcurementCentre[]>(() => loadInitial('centres', INITIAL_CENTRES));
  const [slots, setSlots] = useState<CentreSlot[]>(() => loadInitial('slots', INITIAL_SLOTS));
  const [bookings, setBookings] = useState<SlotBooking[]>(() => loadInitial('bookings', INITIAL_BOOKINGS));
  const [tokens, setTokens] = useState<QueueToken[]>(() => loadInitial('tokens', INITIAL_TOKENS));
  const [transactions, setTransactions] = useState<ProcurementTransaction[]>(() =>
    loadInitial('transactions', INITIAL_TRANSACTIONS)
  );
  const [vendors, setVendors] = useState<Vendor[]>(() => loadInitial('vendors', INITIAL_VENDORS));
  const [aggregatedStocks, setAggregatedStocks] = useState<AggregatedMarketStock[]>(() =>
    loadInitial('aggregatedStocks', INITIAL_AGGREGATED_STOCKS)
  );
  const [prices, setPrices] = useState<CommodityPrice[]>(() => loadInitial('prices', INITIAL_PRICES));
  const [govStocks, setGovStocks] = useState<GovernmentStock[]>(() =>
    loadInitial('govStocks', INITIAL_GOV_STOCKS)
  );
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => loadInitial('alerts', INITIAL_ALERTS));
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    loadInitial('complaints', INITIAL_COMPLAINTS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadInitial('auditLogs', INITIAL_AUDIT_LOGS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadInitial('notifications', INITIAL_NOTIFICATIONS)
  );
  const [vendorRequests, setVendorRequests] = useState<VendorRequest[]>(() =>
    loadInitial('vendorRequests', INITIAL_VENDOR_REQUESTS)
  );

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('annadata_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('annadata_stocks', JSON.stringify(stocks));
    localStorage.setItem('annadata_slots', JSON.stringify(slots));
    localStorage.setItem('annadata_bookings', JSON.stringify(bookings));
    localStorage.setItem('annadata_tokens', JSON.stringify(tokens));
    localStorage.setItem('annadata_transactions', JSON.stringify(transactions));
    localStorage.setItem('annadata_alerts', JSON.stringify(alerts));
    localStorage.setItem('annadata_complaints', JSON.stringify(complaints));
    localStorage.setItem('annadata_auditLogs', JSON.stringify(auditLogs));
    localStorage.setItem('annadata_notifications', JSON.stringify(notifications));
  }, [stocks, slots, bookings, tokens, transactions, alerts, complaints, auditLogs, notifications]);

  // Derived current farmer or vendor
  const currentFarmer = farmers.find((f) => f.profileId === currentUser.id) || farmers[0];
  const currentVendor = vendors.find((v) => v.profileId === currentUser.id) || vendors[0];

  // Helper to log sensitive actions into government audit ledger
  const createAuditLog = (
    actionType: AuditLog['actionType'],
    recordId: string,
    tableName: string,
    oldValue?: string,
    newValue?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      actionType,
      recordId,
      tableName,
      oldValue,
      newValue,
      ipAddress: '10.24.8.12 (Gov National Intranet Gateway)',
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Helper to dispatch in-app notification
  const dispatchNotification = (
    userId: string,
    title: string,
    message: string,
    category: NotificationItem['category']
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      category,
      read: false,
      deliveryStatus: 'SMS Mock Sent',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Switch role seamlessly
  const switchUserRole = (role: UserRole) => {
    const target = DEMO_PROFILES.find((p) => p.role === role) || {
      id: `user-${role}-demo`,
      role,
      fullName: `${role.toUpperCase().replace('_', ' ')} Officer`,
      mobileNumber: '+91 98000 00000',
      email: `${role}@annadatasetu.gov.in`,
      state: 'Rajasthan',
      district: 'Jaipur',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(target);
    setIsAuthenticated(true);
    createAuditLog('QUEUE_ADVANCED', target.id, 'profiles', undefined, `Role Switched to: ${role}`);
  };

  // Authentication mocks
  const loginWithOtp = async (_mobile: string, _otp: string): Promise<boolean> => {
    setIsAuthenticated(true);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsAuthenticated(true);
    return true;
  };

  const loginWithEmail = async (_email: string, _pass: string): Promise<boolean> => {
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const completeFarmerProfile = (data: Partial<Farmer>) => {
    setFarmers((prev) =>
      prev.map((f) => (f.profileId === currentUser.id ? { ...f, ...data } : f))
    );
    createAuditLog('TRANSACTION_MODIFIED', currentUser.id, 'farmers', undefined, 'Profile Completed');
  };

  const completeVendorProfile = (data: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.profileId === currentUser.id ? { ...v, ...data } : v))
    );
    createAuditLog('VENDOR_VERIFIED', currentUser.id, 'vendors', undefined, 'Vendor Details Updated');
  };

  // 1. Slot Booking Flow
  const bookSlot = ({
    farmerId,
    centreId,
    cropId,
    slotDate,
    timeWindow,
    quantity,
  }: {
    farmerId: string;
    centreId: string;
    cropId: string;
    slotDate: string;
    timeWindow: string;
    quantity: number;
  }): SlotBooking => {
    const bookingRef = `SB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nextSeq = tokens.length + 110;
    const tokenNumber = `A-${nextSeq}`;
    const selectedCentre = centres.find((c) => c.id === centreId);
    const selectedCrop = crops.find((c) => c.id === cropId);
    const farmer = farmers.find((f) => f.id === farmerId);

    // Decrement slot capacity
    setSlots((prev) =>
      prev.map((s) =>
        s.centreId === centreId && s.timeWindow === timeWindow
          ? { ...s, bookedCount: Math.min(s.capacity, s.bookedCount + 1) }
          : s
      )
    );

    // Create Booking
    const newBooking: SlotBooking = {
      id: `booking-${Date.now()}`,
      bookingReference: bookingRef,
      farmerId,
      farmerName: farmer?.farmerId || 'Farmer',
      centreId,
      centreName: selectedCentre?.name || 'Mandi Centre',
      slotId: `slot-${Date.now()}`,
      cropId,
      cropName: selectedCrop?.name || 'Crop',
      slotDate,
      timeWindow,
      declaredQuantityQuintals: quantity,
      bookingStatus: 'Confirmed',
      tokenNumber,
      createdAt: new Date().toISOString(),
    };

    // Create Queue Token
    const newToken: QueueToken = {
      id: `token-${Date.now()}`,
      tokenNumber,
      bookingId: newBooking.id,
      centreId,
      farmerId,
      farmerName: currentUser.fullName,
      cropName: selectedCrop?.name || 'Crop',
      quantityQuintals: quantity,
      queueDate: slotDate,
      sequenceOrder: nextSeq,
      status: 'WAITING',
      estimatedWaitMinutes: 45,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setTokens((prev) => [...prev, newToken]);

    // Audit and Notification
    createAuditLog(
      'SLOT_BOOKED',
      bookingRef,
      'slot_bookings',
      undefined,
      `Slot booked for ${quantity} Qtl ${selectedCrop?.name} at ${selectedCentre?.name}. Token: ${tokenNumber}`
    );

    dispatchNotification(
      currentUser.id,
      `Slot Confirmed: Token ${tokenNumber}`,
      `Your procurement slot at ${selectedCentre?.name} on ${slotDate} (${timeWindow}) has been confirmed with Queue Token ${tokenNumber}.`,
      'Slot'
    );

    return newBooking;
  };

  // 2. Queue Advancement Flow
  const advanceQueueToken = (tokenId: string, newStatus: QueueTokenStatus) => {
    const targetToken = tokens.find((t) => t.id === tokenId);
    if (!targetToken) return;

    const oldStatus = targetToken.status;
    const now = new Date().toISOString();

    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === tokenId) {
          return {
            ...t,
            status: newStatus,
            calledAt: newStatus === 'CALLED' ? now : t.calledAt,
            completedAt: newStatus === 'COMPLETED' ? now : t.completedAt,
            estimatedWaitMinutes: newStatus === 'COMPLETED' ? 0 : t.estimatedWaitMinutes,
          };
        }
        return t;
      })
    );

    createAuditLog(
      'QUEUE_ADVANCED',
      targetToken.tokenNumber,
      'queue_tokens',
      oldStatus,
      `Status updated to ${newStatus}`
    );

    // Notify farmer of status change
    dispatchNotification(
      targetToken.farmerId,
      `Queue Update: Token ${targetToken.tokenNumber}`,
      `Your token status has progressed to ${newStatus}. Please follow the instructions on your mandi display board.`,
      'Queue'
    );
  };

  // 3. Complete Procurement & Generate Transaction
  const completeProcurement = ({
    bookingId,
    tokenId,
    farmerId,
    centreId,
    cropId,
    quantityQuintals,
    mspRate,
    qualityGrade,
    moisturePct,
    foreignMatterPct,
    grossWeightKg,
    tareWeightKg,
  }: {
    bookingId: string;
    tokenId: string;
    farmerId: string;
    centreId: string;
    cropId: string;
    quantityQuintals: number;
    mspRate: number;
    qualityGrade: string;
    moisturePct: number;
    foreignMatterPct: number;
    grossWeightKg: number;
    tareWeightKg: number;
  }): ProcurementTransaction => {
    const txnId = `TXN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const vfyCode = `AS-VFY-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const utrRef = `PFMS202603${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const grossAmount = quantityQuintals * mspRate;
    const netPayable = grossAmount; // ₹0 authorised deductions guarantee
    const netWeight = grossWeightKg - tareWeightKg;

    const farmer = farmers.find((f) => f.id === farmerId);
    const centre = centres.find((c) => c.id === centreId);
    const crop = crops.find((c) => c.id === cropId);
    const targetToken = tokens.find((t) => t.id === tokenId);

    const newTxn: ProcurementTransaction = {
      id: `txn-${Date.now()}`,
      transactionId: txnId,
      bookingId,
      tokenId,
      farmerId,
      farmerName: targetToken?.farmerName || 'Ramesh Kumar',
      farmerCode: farmer?.farmerId || 'FMR-1024',
      centreId,
      centreName: centre?.name || 'Jaipur Mandi',
      cropId,
      cropName: crop?.name || 'Wheat',
      quantityQuintals,
      mspRate,
      actualRate: mspRate,
      grossAmount,
      authorisedCharges: 0.0,
      unauthorisedCharges: 0.0,
      netPayableAmount: netPayable,
      qualityGrade,
      moisturePercentage: moisturePct,
      foreignMatterPercentage: foreignMatterPct,
      grossWeightKg,
      tareWeightKg,
      netWeightKg: netWeight,
      paymentStatus: 'Credited',
      digitalReceiptHash: `sha256-${Date.now().toString(16)}-99ab12`,
      verificationCode: vfyCode,
      dbtReferenceUtr: utrRef,
      bankAccountMask: farmer?.bankAccountMask || 'XXXX-XXXX-4819',
      timestamp: new Date().toISOString(),
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Mark token and booking completed
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, status: 'COMPLETED', completedAt: new Date().toISOString() } : t))
    );
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'Completed' } : b))
    );

    // Update centre metrics
    setCentres((prev) =>
      prev.map((c) =>
        c.id === centreId
          ? {
              ...c,
              todayCompletedCount: (c.todayCompletedCount || 0) + 1,
            }
          : c
      )
    );

    createAuditLog(
      'PROCUREMENT_COMPLETED',
      txnId,
      'procurement_transactions',
      undefined,
      `Procured ${quantityQuintals} Qtl @ ₹${mspRate}. Net: ₹${netPayable}. UTR: ${utrRef}`
    );

    dispatchNotification(
      farmer?.profileId || 'user-farmer-01',
      `Payment Credited: ₹${netPayable.toLocaleString('en-IN')}`,
      `Procurement receipt ${txnId} generated. Net amount ₹${netPayable.toLocaleString(
        'en-IN'
      )} has been credited to your bank account via PFMS/DBT under UTR ${utrRef}.`,
      'Payment'
    );

    return newTxn;
  };

  // 4. Add Farmer Stock
  const addFarmerStock = (newStockData: Omit<FarmerStock, 'id' | 'createdAt'>) => {
    const newStock: FarmerStock = {
      ...newStockData,
      id: `stock-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStocks((prev) => [newStock, ...prev]);

    // Update aggregated district stock
    setAggregatedStocks((prev) =>
      prev.map((item) => {
        if (item.cropName.toLowerCase().includes(newStock.cropName.toLowerCase().split(' ')[0])) {
          return {
            ...item,
            totalAggregatedQuintals: item.totalAggregatedQuintals + newStock.availableStockQuintals,
            participatingFarmersCount: item.participatingFarmersCount + 1,
          };
        }
        return item;
      })
    );

    createAuditLog(
      'STOCK_UPDATED',
      newStock.id,
      'farmer_stock',
      undefined,
      `Added ${newStock.availableStockQuintals} Qtl of ${newStock.cropName}`
    );

    dispatchNotification(
      currentUser.id,
      'Stock Declared Successfully',
      `Your declaration of ${newStock.availableStockQuintals} Qtl of ${newStock.cropName} is now recorded.`,
      'Procurement'
    );
  };

  // 5. Complaints Module
  const submitComplaint = (data: Omit<Complaint, 'id' | 'complaintCode' | 'createdAt'>): Complaint => {
    const code = `CMP-2026-${Math.floor(4000 + Math.random() * 5000)}`;
    const newComplaint: Complaint = {
      ...data,
      id: `cmp-${Date.now()}`,
      complaintCode: code,
      createdAt: new Date().toISOString(),
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    createAuditLog('COMPLAINT_RESOLVED', code, 'complaints', undefined, `Complaint Filed: ${data.category}`);

    dispatchNotification(
      currentUser.id,
      `Grievance Registered: ${code}`,
      `Your grievance under category "${data.category}" has been lodged. DMO / Mandi Supervisor will investigate.`,
      'Grievance'
    );

    return newComplaint;
  };

  const resolveComplaint = (complaintId: string, status: Complaint['status'], notes: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              resolutionNotes: notes,
              resolvedAt: new Date().toISOString(),
            }
          : c
      )
    );

    createAuditLog('COMPLAINT_RESOLVED', complaintId, 'complaints', undefined, `Status: ${status}. Notes: ${notes}`);
  };

  // 6. Vendor Procurement Interest
  const sendVendorInterest = (req: Omit<VendorRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: VendorRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setVendorRequests((prev) => [newReq, ...prev]);

    createAuditLog(
      'TRANSACTION_MODIFIED',
      newReq.id,
      'vendor_requests',
      undefined,
      `Vendor ${req.vendorName} sent interest for ${req.targetQuantityQuintals} Qtl ${req.cropName}`
    );
  };

  // 7. Update Commodity Price & Trigger Anomaly Detection Engine
  const updateCommodityPrice = (id: string, newRetailPrice: number, newWholesalePrice?: number) => {
    const target = prices.find((p) => p.id === id);
    if (!target) return;

    const oldPrice = target.retailPrice;
    const pctChange = Number((((newRetailPrice - oldPrice) / oldPrice) * 100).toFixed(1));
    const wholesale = newWholesalePrice !== undefined ? newWholesalePrice : target.wholesalePrice;
    const spread = Number((newRetailPrice - target.farmGatePrice).toFixed(2));

    setPrices((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              retailPrice: newRetailPrice,
              wholesalePrice: wholesale,
              spread,
              change24h: pctChange,
            }
          : p
      )
    );

    createAuditLog(
      'PRICE_UPDATED',
      `${target.commodity}-${target.district}`,
      'commodity_prices',
      `₹${oldPrice}/kg`,
      `₹${newRetailPrice}/kg (+${pctChange}%)`
    );

    // Deterministic Anomaly Trigger (Prototype Analytics Engine)
    if (pctChange >= 10 || spread > target.farmGatePrice * 0.8) {
      const severity = pctChange > 25 ? 'High Alert' : 'Medium';
      const reason = `Automated Rule Engine Flag: Retail price surged by ${pctChange}% in 24h. Price spread reached ₹${spread}/kg. Requires official verification.`;
      
      const newAlert: PriceAlert = {
        id: `alert-${Date.now()}`,
        commodity: target.commodity,
        district: target.district,
        alertType: pctChange > 20 ? 'Price Spike' : 'Abnormal Price Spread',
        severity,
        currentPrice: newRetailPrice,
        benchmarkPrice: oldPrice,
        percentageDeviation: Math.abs(pctChange),
        anomalyReason: reason,
        status: 'Flagged for Review',
        createdAt: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 8. Execute Benchmark Scenario (Ramesh Kumar - 12 Quintals Wheat)
  const executeRameshDemoScenario = () => {
    // Switch to Ramesh Kumar (Farmer)
    switchUserRole('farmer');
    // Ensure Ramesh Kumar's token A-124 is present
    const rameshToken = tokens.find((t) => t.tokenNumber === 'A-124');
    if (rameshToken) {
      // Simulate live queue progression from A-110 to A-124
      advanceQueueToken(rameshToken.id, 'CALLED');
    }
    dispatchNotification(
      'user-farmer-01',
      'SIH Demo Scenario Triggered',
      'Ramesh Kumar procurement cycle simulated: Slot 10-11 AM, Token A-124 called, 12 Qtl Wheat @ ₹2,425, DBT Credited.',
      'Procurement'
    );
  };

  // Reset to initial demo baseline
  const resetDemoData = () => {
    localStorage.clear();
    setFarmers(INITIAL_FARMERS);
    setStocks(INITIAL_STOCKS);
    setCentres(INITIAL_CENTRES);
    setSlots(INITIAL_SLOTS);
    setBookings(INITIAL_BOOKINGS);
    setTokens(INITIAL_TOKENS);
    setTransactions(INITIAL_TRANSACTIONS);
    setVendors(INITIAL_VENDORS);
    setAggregatedStocks(INITIAL_AGGREGATED_STOCKS);
    setPrices(INITIAL_PRICES);
    setGovStocks(INITIAL_GOV_STOCKS);
    setAlerts(INITIAL_ALERTS);
    setComplaints(INITIAL_COMPLAINTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setVendorRequests(INITIAL_VENDOR_REQUESTS);
    setCurrentUser(DEMO_PROFILES[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        currentFarmer,
        currentVendor,
        isAuthenticated,
        switchUserRole,
        loginWithOtp,
        loginWithGoogle,
        loginWithEmail,
        logout,
        completeFarmerProfile,
        completeVendorProfile,
        farmers,
        crops,
        stocks,
        centres,
        slots,
        bookings,
        tokens,
        transactions,
        vendors,
        aggregatedStocks,
        prices,
        govStocks,
        alerts,
        complaints,
        auditLogs,
        notifications,
        vendorRequests,
        bookSlot,
        advanceQueueToken,
        completeProcurement,
        addFarmerStock,
        submitComplaint,
        resolveComplaint,
        sendVendorInterest,
        updateCommodityPrice,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        executeRameshDemoScenario,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
