-- ============================================================
-- VICC WWT — Seed checklist items from Excel
-- frequency: 'daily' = operator checks every shift
--            'monthly' = manager reviews once/month
-- ============================================================

insert into public.checklist_items (kea_id, code, question_vi, question_en, guideline_vi, frequency, sort_order) values

-- KEA 1 (id=1) – Hệ thống quản lý (MONTHLY)
(1,'I.1','Có Hướng dẫn vận hành HTXLNT (SOP-18) được niêm yết tại khu vực vận hành và truyền đạt cho nhân viên không?','Is the WWT Operation SOP posted at the treatment area and communicated to operators?','Kiểm tra SOP được niêm yết và truyền đạt. Check SOP is posted and communicated.','monthly',1),
(1,'I.2','Nhân viên vận hành mặc đúng đồng phục và có đeo thẻ nhân viên không?','Do operators wear proper uniforms and ID badges?','Quan sát trực tiếp. Direct observation.','monthly',2),
(1,'I.3','Sơ đồ bể và quy trình vận hành được hiển thị tại khu vực vận hành không?','Is the tank diagram and operation flowchart displayed at the WWT area?','Kiểm tra bảng hiển thị. Check display board.','monthly',3),
(1,'I.4','Có danh sách nhân sự vận hành HTXLNT được cập nhật và phân công nhiệm vụ rõ ràng không?','Is there an updated staff list with clear duty assignments for WWT operations?','Kiểm tra danh sách nhân sự. Check staff roster.','monthly',4),
(1,'I.5','Hồ sơ nhân sự (hợp đồng, bằng cấp, kết quả khám sức khoẻ) của nhân viên vận hành được lưu trữ đầy đủ không?','Are HR records (contracts, qualifications, health check results) for WWT operators complete?','Kiểm tra hồ sơ nhân sự. Check HR files.','monthly',5),
(1,'I.6','Có nội quy khu vực HTXLNT được ban hành và nhân viên ký xác nhận không?','Is there a WWT area regulation issued and signed by operators?','Kiểm tra nội quy và chữ ký. Check regulations and signatures.','monthly',6),
(1,'I.7','Có kế hoạch bảo dưỡng định kỳ thiết bị HTXLNT được lập và thực hiện không?','Is there a periodic maintenance plan for WWT equipment in place and being implemented?','Kiểm tra kế hoạch bảo dưỡng. Check maintenance plan.','monthly',7),

-- KEA 2 (id=2) – Vận hành thiết bị & Hoá chất (DAILY)
(2,'II.1','Bơm nước thải đầu vào hoạt động bình thường (không rò rỉ, không rung lắc bất thường)?','Is the influent sewage pump operating normally (no leaks, no abnormal vibration)?','Quan sát và ghi nhận tình trạng bơm. Observe and log pump status.','daily',8),
(2,'II.2','Bể điều hoà không có mùi hôi bất thường và mực nước trong giới hạn?','Is the equalization tank free of abnormal odor and water level within limits?','Kiểm tra mực nước và mùi. Check water level and odor.','daily',9),
(2,'II.3','Hoá chất PAC/NaOH/Polymer còn đủ cho ít nhất 7 ngày vận hành?','Are PAC/NaOH/Polymer chemicals sufficient for at least 7 days of operation?','Kiểm tra tồn kho hoá chất. Check chemical inventory.','daily',10),
(2,'II.4','Bơm định lượng hoá chất hoạt động đúng liều lượng và không rò rỉ?','Are chemical dosing pumps operating at correct dosage and without leaks?','Quan sát và điều chỉnh bơm định lượng. Observe and adjust dosing pumps.','daily',11),
(2,'II.5','Hệ thống sục khí (máy thổi khí / máy khuấy) hoạt động bình thường?','Is the aeration system (blower/mixer) operating normally?','Nghe tiếng máy, kiểm tra áp lực khí. Listen to machine, check air pressure.','daily',12),
(2,'II.6','Bể lắng không có váng nổi bất thường và bùn lắng đúng yêu cầu?','Is the sedimentation tank free of abnormal scum and sludge settling correctly?','Quan sát bể lắng. Observe sedimentation tank.','daily',13),
(2,'II.7','Thiết bị lọc (màng lọc / bể lọc cát) không bị tắc và hoạt động đúng?','Is the filtration equipment (membrane/sand filter) unclogged and functioning correctly?','Kiểm tra áp lực và lưu lượng đầu ra. Check pressure and outflow.','daily',14),
(2,'II.8','Hóa chất CTNH (PAC, NaOH, Chlorine) được lưu trữ đúng quy định, có nhãn hiệu và SDS?','Are hazardous chemicals (PAC, NaOH, Chlorine) stored properly with labels and SDS?','Kiểm tra kho hoá chất và nhãn SDS. Check chemical storage and SDS labels.','daily',15),

-- KEA 3 (id=3) – An toàn, PPE & Kiểm tra (DAILY)
(3,'III.1','Nhân viên vận hành mặc đầy đủ PPE (găng tay, kính bảo hộ, ủng, khẩu trang) khi vận hành HTXLNT?','Do operators wear full PPE (gloves, safety glasses, boots, mask) during WWT operations?','Quan sát trực tiếp. Direct observation.','daily',16),
(3,'III.2','Biển cảnh báo an toàn (nguy hiểm điện, hoá chất, ngã) được gắn đầy đủ tại các vị trí nguy hiểm?','Are safety warning signs (electrical, chemical, fall hazards) posted at all hazardous locations?','Đi kiểm tra thực địa. On-site walkthrough.','daily',17),
(3,'III.3','Thiết bị cứu hộ (áo phao, thang thoát hiểm) sẵn sàng sử dụng và không bị chắn?','Are rescue equipment (life jackets, emergency ladders) ready to use and unobstructed?','Kiểm tra thiết bị cứu hộ. Check rescue equipment.','daily',18),
(3,'III.4','Tủ sơ cứu được trang bị đầy đủ và không hết hạn?','Is the first aid kit fully stocked and not expired?','Kiểm tra tủ sơ cứu. Check first aid cabinet.','daily',19),
(3,'III.5','Khu vực HTXLNT sạch sẽ, không có dầu mỡ, không trơn trượt?','Is the WWT area clean, free of oil/grease, and non-slippery?','Quan sát khu vực vận hành. Observe operation area.','daily',20),
(3,'III.6','Kiểm tra và ghi nhận tình trạng tủ điện điều khiển (không có cáp hở, đèn báo bình thường)?','Is the electrical control panel checked and logged (no exposed cables, status lights normal)?','Kiểm tra tủ điện và ghi nhật ký. Check panel and log.','daily',21),
(3,'III.7','Cảm biến pH tự động tại bể trung hoà được hiệu chuẩn hàng tuần?','Is the automatic pH sensor at the neutralization tank calibrated weekly?','Kiểm tra nhật ký hiệu chuẩn pH. Check pH calibration log.','daily',22),
(3,'III.8','Thiết bị phát hiện khí độc (H2S) hoạt động và được kiểm tra định kỳ?','Is the toxic gas detector (H2S) operational and periodically tested?','Kiểm tra thiết bị phát hiện khí. Check gas detection equipment.','daily',23),
(3,'III.9','Khi tủ điện báo sự cố, nhân viên có quy trình xử lý và ghi nhận kịp thời?','When the control panel signals a fault, do operators have a procedure to respond and log promptly?','Phỏng vấn nhân viên và kiểm tra hồ sơ sự cố. Interview and check incident records.','daily',24),

-- KEA 4 (id=4) – Giám sát chỉ tiêu & Ứng phó sự cố (DAILY)
(4,'IV.1','Chỉ số pH đầu vào và đầu ra được kiểm tra và ghi nhận hàng ngày? (Tiêu chuẩn đầu ra: 5.5–9.0)','Are influent and effluent pH checked and logged daily? (Effluent standard: 5.5–9.0)','Kiểm tra nhật ký đo pH hàng ngày. Check daily pH log.','daily',25),
(4,'IV.2','Nồng độ oxy hòa tan (DO) tại bể MBBR/Aerotank được đo hàng ngày và duy trì 1.5–2.5 mg/L?','Is dissolved oxygen (DO) in MBBR/Aerotank measured daily and maintained at 1.5–2.5 mg/L?','Kiểm tra nhật ký DO. Check DO log.','daily',26),
(4,'IV.3','Chỉ số bùn hoạt tính (SV/SVI) được đo hàng ngày và duy trì SV=300–700 ml/L, SVI≤150 ml/g?','Is activated sludge index (SV/SVI) measured daily: SV=300–700 ml/L, SVI≤150 ml/g?','Kiểm tra nhật ký SV/SVI. Check SV/SVI log.','daily',27),
(4,'IV.4','MLSS tại bể sinh học được đo và duy trì trong khoảng 2500–3500 mg/L?','Is MLSS in the biological tank measured and maintained at 2500–3500 mg/L?','Kiểm tra nhật ký MLSS. Check MLSS log.','daily',28),
(4,'IV.5','COD và Amoni đầu ra được kiểm tra ít nhất 1 lần/tuần (COD≤150 mg/L; NH₄⁺≤10 mg/L)?','Are effluent COD and Ammonium tested at least weekly? (COD≤150 mg/L; NH₄⁺≤10 mg/L)','Kiểm tra kết quả test COD và Amoni. Check COD/ammonium test results.','daily',29),
(4,'IV.6','Lưu lượng nước thải đầu ra được ghi nhận hàng ngày qua đồng hồ đo lưu lượng? (Max 70 m³/ngày)','Is effluent flow recorded daily via flow meter? (Max 70 m³/day)','Kiểm tra sổ ghi chỉ số đồng hồ. Check meter reading log.','daily',30),
(4,'IV.7','Khi phát hiện chỉ tiêu vượt QCVN 40:2011/Cột B, nhân viên báo cáo ngay cho HSE và lập biên bản trong 2h?','When effluent exceeds QCVN 40:2011/Col.B limits, do operators report to HSE and file report within 2h?','Kiểm tra hồ sơ sự cố và biên bản. Check incident records and reports.','daily',31),
(4,'IV.8','Hệ thống bùn (bơm bùn, đường ống bùn, bể chứa bùn) được kiểm tra và ghi nhận định kỳ?','Are sludge systems (pumps, pipelines, storage tank) checked and logged periodically?','Kiểm tra nhật ký bơm bùn. Check sludge pump log.','daily',32),
(4,'IV.9','Bảo vệ / nhân viên vận hành ghi nhận và kiểm tra chỉ số điện, nước hàng ca; báo cáo ngay bất thường?','Do operators log electricity and water meter readings each shift and report anomalies immediately?','Kiểm tra sổ ghi chỉ số. Check reading log.','daily',33),

-- KEA 5 (id=5) – Hồ sơ & Đào tạo (MONTHLY)
(5,'V.1','Tất cả biểu mẫu vận hành HTXLNT được kiểm soát phiên bản trên SharePoint?','Are all WWT operation forms version-controlled on SharePoint?','Kiểm tra trên hệ thống SharePoint. Check SharePoint system.','monthly',34),
(5,'V.2','Hồ sơ vận hành HTXLNT được lưu trữ ít nhất 12 tháng?','Are WWT operation records retained for at least 12 months?','Kiểm tra nơi lưu và thời gian giữ hồ sơ. Check storage and retention period.','monthly',35),
(5,'V.3','Có kế hoạch đào tạo nhân viên vận hành mới về HTXLNT và hồ sơ đào tạo được lưu trữ?','Is there a training plan for new WWT operators and are training records maintained?','Kiểm tra kế hoạch và hồ sơ đào tạo. Check training plan and records.','monthly',36),
(5,'V.4','Có kế hoạch đào tạo định kỳ hàng tháng cho nhân viên vận hành về quy trình HTXLNT?','Is there a monthly periodic training plan for WWT operators on operation procedures?','Kiểm tra hồ sơ đào tạo định kỳ. Check periodic training records.','monthly',37),
(5,'V.5','Có biên bản bàn giao ca ghi nhận đầy đủ tình trạng thiết bị, sự cố và chỉ tiêu vận hành?','Is there a complete shift handover record covering equipment status, incidents, and operation parameters?','Kiểm tra sổ bàn giao ca. Check shift handover log.','monthly',38),
(5,'V.6','Có checklist audit nội bộ định kỳ hàng tháng về vận hành HTXLNT do HSE thực hiện?','Is there a monthly internal audit checklist for WWT operations conducted by HSE?','Kiểm tra hồ sơ audit và báo cáo. Check audit records.','monthly',39),
(5,'V.7','Báo cáo quan trắc môi trường định kỳ được gửi đúng hạn theo Giấy phép môi trường?','Are periodic environmental monitoring reports submitted on time per the Environmental License?','Kiểm tra lịch gửi báo cáo và biên nhận. Check report submission schedule.','monthly',40),

-- KEA 6 (id=6) – KPI & Cải tiến liên tục (MONTHLY)
(6,'VI.1','Có bảng tổng hợp kết quả self-assessment HTXLNT và % hoàn thành định kỳ hàng tháng?','Is there a WWT self-assessment summary with monthly completion percentage?','Kiểm tra file tổng hợp Excel. Check summary Excel file.','monthly',41),
(6,'VI.2','Có KPI theo dõi: lưu lượng xử lý, % tuân thủ QCVN, tỷ lệ sự cố thiết bị, chi phí hoá chất?','Are KPIs tracked: treatment flow, QCVN compliance rate, equipment incident rate, chemical costs?','Kiểm tra báo cáo KPI tháng. Check monthly KPI report.','monthly',42),
(6,'VI.3','Hành động khắc phục (CAPA) từ các phát hiện audit hoặc sự cố được theo dõi đến khi đóng hoàn tất?','Are corrective actions (CAPA) from audit findings or incidents tracked until fully closed?','Kiểm tra CAPA log. Check CAPA log.','monthly',43),
(6,'VI.4','Có họp review kết quả vận hành HTXLNT với Giám đốc nhà máy và HSE định kỳ hàng tháng?','Is there a monthly WWT performance review meeting with the Plant Manager and HSE?','Kiểm tra hồ sơ họp và biên bản. Check meeting records.','monthly',44),
(6,'VI.5','Nhân viên vận hành tuân thủ tác phong chuẩn mực: đúng giờ, đồng phục, không sử dụng điện thoại cá nhân?','Do operators maintain professional conduct: punctuality, uniform, no personal phones during duty?','Quan sát trực tiếp / kiểm tra camera / phản hồi HSE. Observe / camera / HSE feedback.','monthly',45),
(6,'VI.6','Nhân viên vận hành chịu trách nhiệm giữ gìn trật tự và vệ sinh khu vực HTXLNT?','Are operators responsible for maintaining order and cleanliness in the WWT area?','Kiểm tra khu vực vận hành thực tế. Check WWT operation area.','monthly',46),
(6,'VI.7','Nhân viên vận hành báo cáo kịp thời và trung thực các sự cố, không che giấu không bỏ qua vi phạm?','Do operators report incidents promptly and honestly without concealing or ignoring violations?','Kiểm tra hồ sơ sự cố và đối chiếu nhật ký. Check incident records against logs.','monthly',47),
(6,'VI.8','Nhân viên nắm rõ quy trình vận hành, QCVN 40:2011 và các chỉ tiêu cần duy trì tại vị trí trực?','Do operators know the operation procedures, QCVN 40:2011 limits, and parameters to maintain?','Phỏng vấn ngẫu nhiên, quan sát thực tế. Random interview, on-site observation.','monthly',48),
(6,'VI.9','Bùn dư được hút định kỳ 6 tháng/lần bởi đơn vị thu gom CTNH có giấy phép và có manifest lưu trữ?','Is excess sludge collected every 6 months by a licensed hazardous waste collector with manifest stored?','Kiểm tra hợp đồng CTNH và vcl bùn. Check hazardous waste contract and sludge manifest.','monthly',49);
