export interface RegistrationEntry {
  id: string;
  time: string;
  fullName: string;
  phone: string;
  numbers: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  note: string;
  createdAt: Date;
}

export const DUMMY_DATA: RegistrationEntry[] = [
  {
    id: 'REG-001',
    time: '10:30',
    fullName: 'Nguyễn Văn An',
    phone: '0901234567',
    numbers: '12, 45, 78',
    region: 'Miền Bắc',
    note: 'Đăng ký ưu tiên',
    createdAt: new Date(),
  },
  {
    id: 'REG-002',
    time: '11:15',
    fullName: 'Trần Thị Bình',
    phone: '0912345678',
    numbers: '05, 23',
    region: 'Miền Trung',
    note: '',
    createdAt: new Date(),
  },
  {
    id: 'REG-003',
    time: '08:45',
    fullName: 'Lê Văn Cường',
    phone: '0987654321',
    numbers: '99',
    region: 'Miền Nam',
    note: 'Khách hàng thân thiết',
    createdAt: new Date(),
  },
  {
    id: 'REG-004',
    time: '14:20',
    fullName: 'Phạm Minh Đức',
    phone: '0345678901',
    numbers: '10, 20, 30, 40',
    region: 'Miền Bắc',
    note: 'Cần hỗ trợ thêm',
    createdAt: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: 'REG-005',
    time: '16:50',
    fullName: 'Hoàng Thị Hoa',
    phone: '0765432109',
    numbers: '01, 02',
    region: 'Miền Nam',
    note: '',
    createdAt: new Date(Date.now() - 86400000), // Yesterday
  },
];
