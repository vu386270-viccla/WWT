-- ============================================================
-- VICC WWT — Seed checklist từ Excel "WWT Self Assessment.xlsx"
-- Cập nhật theo cấu trúc KEA mới (6 KEAs)
-- frequency: 'daily' | 'monthly' | 'both'
-- ============================================================

insert into public.checklist_items (kea_id, code, question_vi, question_en, guideline_vi, frequency, sort_order) values

-- ─── KEA 1 (id=1) – Hệ thống quản lý & Trách nhiệm vận hành (MONTHLY) ────────
(1,'I.1',
 'Có Hướng dẫn vận hành HTXLNT (HSE.V.HS.SOP-18) được niêm yết tại khu vực vận hành và truyền đạt cho nhân viên vận hành không?',
 'Is the WWT Operation SOP posted at the treatment area and communicated to relevant operators?',
 'Kiểm tra SOP được niêm yết và truyền đạt tại hiện trường.',
 'monthly', 1),

(1,'I.2',
 'Có danh sách liên hệ khẩn cấp (HSE / Quản lý nhà máy / Cơ quan địa phương) được niêm yết tại khu vực HTXLNT không?',
 'Is there a list of key contacts (HSE / Plant Manager / Local Authority) posted at WWT area?',
 'Kiểm tra danh sách liên hệ tại khu vực vận hành.',
 'monthly', 2),

(1,'I.3',
 'Nhân viên vận hành HTXLNT có được đào tạo đầy đủ và hồ sơ đào tạo được lưu trữ không?',
 'Are WWT operators properly trained with training records available?',
 'Xem kế hoạch đào tạo và hồ sơ.',
 'monthly', 3),

(1,'I.4',
 'Có hợp đồng/quyết định phân công trách nhiệm vận hành HTXLNT rõ ràng không?',
 'Is there a clear assignment of responsibilities for WWT operation?',
 'Kiểm tra quyết định phân công và hồ sơ liên quan.',
 'monthly', 4),

(1,'I.5',
 'Kế hoạch vận hành và bảo trì HTXLNT đã được phê duyệt bởi Quản lý nhà máy chưa?',
 'Has the WWT operation and maintenance plan been approved by management?',
 'Kiểm tra kế hoạch và chữ ký phê duyệt.',
 'monthly', 5),

(1,'I.6',
 'Có sơ đồ mặt bằng HTXLNT và phân công nhiệm vụ trực với lịch kiểm tra không?',
 'Is there a WWT layout diagram and duty assignment with inspection schedule?',
 'Kiểm tra sơ đồ bể và lịch trực.',
 'monthly', 6),

(1,'I.7',
 'Có hồ sơ năng lực nhân viên vận hành đầy đủ (chứng chỉ, hợp đồng, CCCD) không?',
 'Are operator personnel files complete (certificates, contract, ID)?',
 'Kiểm tra hồ sơ lưu tại HR.',
 'monthly', 7),

-- ─── KEA 2 (id=2) – Kiểm soát hoá chất & An toàn hoá chất (MONTHLY) ──────────
(2,'II.1',
 'Có bảng MSDS/SDS đầy đủ cho tất cả hoá chất sử dụng (NaOH, HCl, PAC, Polymer, Chlorine) được niêm yết tại kho và khu pha chế không?',
 'Are MSDS/SDS sheets available and posted for all chemicals used?',
 'Kiểm tra MSDS niêm yết tại kho hoá chất.',
 'monthly', 8),

(2,'II.2',
 'Hoá chất được lưu trữ đúng quy định: khu vực riêng, có bund ngăn tràn, dán nhãn cảnh báo, xa nguồn nhiệt không?',
 'Are chemicals stored properly: separate area, bunding, warning labels, away from heat sources?',
 'Quan sát kho lưu trữ hoá chất.',
 'monthly', 9),

(2,'II.3',
 'Nhân viên pha chế hoá chất có sử dụng đầy đủ PPE (kính, găng tay, tạp dề, ủng) không?',
 'Do operators wear full PPE when handling/mixing chemicals?',
 'Quan sát thực tế khi pha chế.',
 'monthly', 10),

(2,'II.4',
 'Có cân định kỳ được hiệu chuẩn để đo lượng hoá chất pha chế không?',
 'Is the scale periodically calibrated for measuring chemical doses?',
 'Kiểm tra nhãn hiệu chuẩn trên cân.',
 'monthly', 11),

(2,'II.5',
 'Tồn kho hoá chất được ghi nhận và kiểm tra định kỳ 3 ngày/lần không?',
 'Is chemical inventory recorded and checked every 3 days?',
 'Kiểm tra nhật ký tồn kho hoá chất.',
 'monthly', 12),

(2,'II.6',
 'Quy trình pha chế cho từng hoá chất (NaOH, HCl, PAC, Polymer, Chlorine) được niêm yết tại khu vực pha chế không?',
 'Are chemical preparation procedures posted at the mixing area for each chemical?',
 'Kiểm tra hướng dẫn pha chế niêm yết.',
 'monthly', 13),

(2,'II.7',
 'Có biện pháp sơ cứu rõ ràng khi tiếp xúc hoá chất (bỏng, hít phải) và nhân viên nắm được quy trình không?',
 'Are first aid procedures for chemical exposure (burns, inhalation) clear and known to operators?',
 'Phỏng vấn ngẫu nhiên nhân viên về quy trình sơ cứu.',
 'monthly', 14),

(2,'II.8',
 'Hoá chất thải bỏ (bùn hoá lý, dung dịch quá hạn) được xử lý đúng quy định CTNH không?',
 'Is chemical waste (chemical sludge, expired solutions) disposed of as hazardous waste?',
 'Kiểm tra hợp đồng thu gom CTNH và manifest.',
 'monthly', 15),

-- ─── KEA 3 (id=3) – Vận hành hệ thống xử lý (Bể & Thiết bị) (MIX) ──────────
(3,'III.1',
 'Tất cả bể xử lý được kiểm tra ngoại quan hàng tuần (nứt, rò rỉ, bùn cặn, ăn mòn) và ghi nhận vào nhật ký không?',
 'Are all treatment tanks visually inspected weekly (cracks, leaks, sediment, corrosion) and logged?',
 'Kiểm tra nhật ký ngoại quan bể.',
 'monthly', 16),

(3,'III.2',
 'Bơm nước thải, bơm định lượng, máy thổi khí được kiểm tra hoạt động và ghi nhận hàng ngày không?',
 'Are wastewater pumps, dosing pumps, and air blowers checked daily and logged?',
 'Kiểm tra nhật ký vận hành thiết bị.',
 'daily', 17),

(3,'III.3',
 'Máy thổi khí hoạt động luân phiên đúng timer (120 phút chạy / 120 phút nghỉ) và duy trì DO = 1.5–2.5 mg/L không?',
 'Are air blowers operating alternately per timer (120 min ON / 120 min OFF) maintaining DO = 1.5–2.5 mg/L?',
 'Quan sát timer và đo DO thực tế.',
 'daily', 18),

(3,'III.4',
 'Giá thể MBBR được kiểm tra định kỳ (không tắc, không thoát ra ngoài lưới chắn) và lưới chắn giá thể còn nguyên vẹn không?',
 'Is MBBR media checked periodically (no clogging, no escape through screen) and retention screen intact?',
 'Quan sát thực tế bể MBBR.',
 'monthly', 19),

(3,'III.5',
 'Bơm bùn tuần hoàn (bể lắng 2 → Anoxic) hoạt động đúng theo timer và lưu lượng không?',
 'Is the sludge recirculation pump (Clarifier 2 → Anoxic) operating correctly per timer and flow?',
 'Kiểm tra timer và lưu lượng bơm tuần hoàn.',
 'daily', 20),

(3,'III.6',
 'Bùn dư được bơm về bể chứa bùn đúng lịch (30 phút chạy / 120 phút nghỉ) không?',
 'Is excess sludge pumped to the sludge tank on schedule (30 min ON / 120 min OFF)?',
 'Kiểm tra timer và mực bùn bể chứa.',
 'daily', 21),

(3,'III.7',
 'Hệ thống đường ống (nước thải, khí, bùn, hoá chất) được kiểm tra rò rỉ và tắc nghẽn hàng tuần không?',
 'Are all pipelines (wastewater, air, sludge, chemical) inspected for leaks and blockages weekly?',
 'Kiểm tra nhật ký và quan sát đường ống.',
 'monthly', 22),

(3,'III.8',
 'Tủ điện điều khiển được kiểm tra đèn báo, rơle nhiệt và CB định kỳ hàng tuần không?',
 'Is the control panel checked for indicator lights, thermal relays, and CBs weekly?',
 'Kiểm tra nhật ký tủ điện.',
 'monthly', 23),

(3,'III.9',
 'Sensor pH tự động tại bể trung hòa được hiệu chuẩn định kỳ hàng tuần không?',
 'Is the automatic pH sensor at the neutralization tank calibrated weekly?',
 'Kiểm tra nhật ký hiệu chuẩn pH.',
 'monthly', 24),

(3,'III.10',
 'Khi tủ điện báo sự cố (đèn lỗi/còi hú), nhân viên có quy trình xử lý và ghi nhận kịp thời không?',
 'When the control panel signals a fault (error light / alarm), do operators have a procedure and log it promptly?',
 'Phỏng vấn nhân viên và kiểm tra hồ sơ sự cố.',
 'both', 25),

-- ─── KEA 4 (id=4) – Giám sát chỉ tiêu nước thải & Ứng phó sự cố (DAILY) ────
(4,'IV.1',
 'Chỉ số pH đầu vào và đầu ra được kiểm tra và ghi nhận hàng ngày không? (Tiêu chuẩn đầu ra: 5.5–9.0)',
 'Are influent and effluent pH checked and logged daily? (Effluent standard: 5.5–9.0)',
 'Kiểm tra nhật ký đo pH hàng ngày.',
 'daily', 26),

(4,'IV.2',
 'Nồng độ oxy hòa tan (DO) tại bể MBBR/Aerotank được đo hàng ngày và duy trì 1.5–2.5 mg/L không?',
 'Is dissolved oxygen (DO) in MBBR/Aerotank measured daily and maintained at 1.5–2.5 mg/L?',
 'Kiểm tra nhật ký DO và kết quả đo.',
 'daily', 27),

(4,'IV.3',
 'Chỉ số bùn hoạt tính (SV/SVI) được đo hàng ngày và duy trì SV = 300–700 ml/L, SVI ≤ 150 ml/g không?',
 'Is activated sludge index (SV/SVI) measured daily: SV = 300–700 ml/L, SVI ≤ 150 ml/g?',
 'Kiểm tra nhật ký SV/SVI và bình đong.',
 'daily', 28),

(4,'IV.4',
 'MLSS tại bể sinh học được đo và duy trì trong khoảng 2500–3500 mg/L không?',
 'Is MLSS in the biological tank measured and maintained at 2500–3500 mg/L?',
 'Kiểm tra nhật ký MLSS định kỳ.',
 'monthly', 29),

(4,'IV.5',
 'COD và Amoni đầu ra được kiểm tra ít nhất 1 lần/tuần (COD ≤ 150 mg/L; NH₄⁺ ≤ 10 mg/L) không?',
 'Are effluent COD and Ammonium tested at least weekly? (COD ≤ 150 mg/L; NH₄⁺ ≤ 10 mg/L)',
 'Kiểm tra kết quả test COD và Amoni hàng tuần.',
 'monthly', 30),

(4,'IV.6',
 'Lưu lượng nước thải đầu ra được ghi nhận hàng ngày qua đồng hồ đo lưu lượng không? (Max 70 m³/ngày)',
 'Is effluent flow recorded daily via flow meter? (Max 70 m³/day)',
 'Kiểm tra sổ ghi chỉ số đồng hồ / ảnh chụp.',
 'daily', 31),

(4,'IV.7',
 'Khi phát hiện chỉ tiêu vượt QCVN 40:2011/Cột B, nhân viên báo cáo ngay cho HSE và lập biên bản trong 2h không?',
 'When effluent exceeds QCVN 40:2011/Col.B limits, is it reported to HSE immediately and documented within 2 hours?',
 'Kiểm tra hồ sơ sự cố và biên bản.',
 'both', 32),

(4,'IV.8',
 'Hệ thống bùn (bơm bùn, đường ống bùn, bể chứa bùn) được kiểm tra và ghi nhận định kỳ không?',
 'Are sludge systems (pumps, pipelines, storage tank) checked and logged periodically?',
 'Kiểm tra nhật ký bơm bùn và mực bể chứa bùn.',
 'monthly', 33),

(4,'IV.9',
 'Nhân viên vận hành ghi nhận và kiểm tra chỉ số điện, nước hàng ngày; báo cáo ngay bất thường không?',
 'Do operators log electricity and water meter readings daily and report anomalies immediately?',
 'Kiểm tra sổ ghi chỉ số / ảnh chụp đồng hồ.',
 'daily', 34),

-- ─── KEA 5 (id=5) – Hồ sơ, tài liệu & Đào tạo (MONTHLY) ──────────────────
(5,'V.1',
 'Tất cả biểu mẫu vận hành HTXLNT (nhật ký vận hành, kiểm tra thiết bị, hoá chất, quan trắc) được kiểm soát phiên bản không?',
 'Are all WWT operation forms (operation log, equipment check, chemical, monitoring) version-controlled?',
 'Kiểm tra trên hệ thống SharePoint / hồ sơ cứng.',
 'monthly', 35),

(5,'V.2',
 'Hồ sơ vận hành HTXLNT được lưu trữ ít nhất 12 tháng không?',
 'Are WWT operation records retained for at least 12 months?',
 'Kiểm tra nơi lưu và thời gian giữ hồ sơ.',
 'monthly', 36),

(5,'V.3',
 'Có kế hoạch đào tạo nhân viên vận hành mới về HTXLNT và hồ sơ đào tạo được lưu trữ không?',
 'Is there a training plan for new WWT operators and are training records retained?',
 'Kiểm tra kế hoạch và hồ sơ đào tạo.',
 'monthly', 37),

(5,'V.4',
 'Có kế hoạch đào tạo định kỳ hàng tháng cho nhân viên vận hành về quy trình HTXLNT không?',
 'Is there a monthly periodic training plan for WWT operators on operation procedures?',
 'Kiểm tra hồ sơ đào tạo định kỳ.',
 'monthly', 38),

(5,'V.5',
 'Có biên bản bàn giao ca ghi nhận đầy đủ tình trạng thiết bị, sự cố và chỉ tiêu vận hành không?',
 'Is there a complete shift handover record covering equipment status, incidents, and operational parameters?',
 'Kiểm tra sổ bàn giao ca / checklist cuối ca.',
 'monthly', 39),

(5,'V.6',
 'Có checklist audit nội bộ định kỳ hàng tháng về vận hành HTXLNT do HSE thực hiện không?',
 'Is there a monthly internal audit checklist for WWT operations conducted by HSE?',
 'Kiểm tra hồ sơ audit và báo cáo.',
 'monthly', 40),

(5,'V.7',
 'Báo cáo quan trắc môi trường định kỳ (nước thải đầu ra) được gửi đúng hạn theo Giấy phép môi trường không?',
 'Are periodic environmental monitoring reports (effluent) submitted on time per the Environmental Permit?',
 'Kiểm tra lịch gửi báo cáo và biên nhận.',
 'monthly', 41),

-- ─── KEA 6 (id=6) – Hiệu suất, KPI & Cải tiến liên tục (MONTHLY) ────────────
(6,'VI.1',
 'Có bảng tổng hợp kết quả self-assessment HTXLNT và % hoàn thành định kỳ hàng tháng không?',
 'Is there a WWT self-assessment summary with monthly completion percentage?',
 'Kiểm tra file tổng hợp Excel.',
 'monthly', 42),

(6,'VI.2',
 'Có KPI theo dõi: lưu lượng xử lý, % tuân thủ QCVN, tỷ lệ sự cố thiết bị, chi phí hoá chất không?',
 'Are KPIs tracked: treatment flow, QCVN compliance rate, equipment incident rate, chemical cost?',
 'Kiểm tra báo cáo KPI tháng / HSE report.',
 'monthly', 43),

(6,'VI.3',
 'Hành động khắc phục (CAPA) từ các phát hiện audit hoặc sự cố được theo dõi đến khi đóng hoàn tất không?',
 'Are corrective actions (CAPA) from audit findings or incidents tracked to full closure?',
 'Kiểm tra CAPA log.',
 'monthly', 44),

(6,'VI.4',
 'Có họp review kết quả vận hành HTXLNT với Giám đốc nhà máy và HSE định kỳ hàng tháng không?',
 'Is there a monthly WWT performance review meeting with the Plant Manager and HSE?',
 'Kiểm tra hồ sơ họp và biên bản.',
 'monthly', 45),

(6,'VI.5',
 'Nhân viên vận hành tuân thủ tác phong chuẩn mực: đúng giờ, đồng phục, không sử dụng điện thoại cá nhân trong giờ trực không?',
 'Do operators maintain professional conduct: punctual, in uniform, no personal phone use during shift?',
 'Quan sát trực tiếp / kiểm tra camera / phản hồi HSE.',
 'monthly', 46),

(6,'VI.6',
 'Nhân viên vận hành chịu trách nhiệm giữ gìn trật tự và vệ sinh khu vực HTXLNT không?',
 'Are operators responsible for maintaining order and cleanliness in the WWT area?',
 'Kiểm tra khu vực vận hành thực tế.',
 'monthly', 47),

(6,'VI.7',
 'Nhân viên vận hành báo cáo kịp thời và trung thực các sự cố, không che giấu hoặc bỏ qua vi phạm không?',
 'Do operators report incidents promptly and honestly without concealment or omission?',
 'Kiểm tra hồ sơ sự cố và đối chiếu nhật ký.',
 'monthly', 48),

(6,'VI.8',
 'Nhân viên nắm rõ quy trình vận hành, QCVN 40:2011 và các chỉ tiêu cần duy trì tại vị trí trực không?',
 'Do operators know the operation procedures, QCVN 40:2011 limits and parameters to maintain?',
 'Phỏng vấn ngẫu nhiên, quan sát thực tế tại chốt.',
 'monthly', 49),

(6,'VI.9',
 'Bùn dư được hút định kỳ 6 tháng/lần bởi đơn vị thu gom CTNH có giấy phép và có manifest lưu trữ không?',
 'Is excess sludge collected every 6 months by a licensed hazardous waste collector with manifest stored?',
 'Kiểm tra hợp đồng CTNH và vcl bùn.',
 'monthly', 50);
