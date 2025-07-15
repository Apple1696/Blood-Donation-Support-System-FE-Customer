import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BloodComponents = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary md:text-4xl">Các Thành Phần Máu</h1>
                <p className="text-muted-foreground mt-2">
                    Tìm hiểu về các thành phần quan trọng của máu và vai trò của chúng trong truyền máu
                </p>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Text Content */}
                <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                        <h2 className="text-2xl font-semibold mb-4">Các Thành Phần Máu Là Gì?</h2>
                        <p className="text-base mb-4">
                            Các thành phần máu là những phần riêng biệt tạo nên máu toàn phần. Khi bạn hiến máu,
                            nó có thể được tách thành các thành phần này, cho phép một lần hiến máu có thể giúp nhiều bệnh nhân
                            với những nhu cầu y tế cụ thể.
                        </p>
                        <h3 className="text-xl font-medium mb-2">Các Thành Phần Chính Của Máu:</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>
                                <strong className="text-primary">Hồng Cầu</strong> - Vận chuyển oxy từ phổi đến các bộ phận khác của cơ thể
                            </li>
                            <li>
                                <strong className="text-primary">Tiểu Cầu</strong> - Giúp máu đông và ngăn chặn chảy máu quá mức
                            </li>
                            <li>
                                <strong className="text-primary">Huyết Tương</strong> - Phần lỏng của máu chứa protein và giúp duy trì huyết áp
                            </li>
                            <li>
                                <strong className="text-primary">Bạch Cầu</strong> - Chống lại nhiễm trùng và bệnh tật
                            </li>
                        </ul>
                        <p className="text-base">
                            Mỗi thành phần đều có chức năng quan trọng và độc đáo trong cơ thể con người. Bằng cách hiến máu, bạn đang cung cấp
                            những thành phần thiết yếu có thể được sử dụng trong các điều trị y tế khác nhau và các tình huống khẩn cấp.
                        </p>
                    </CardContent>
                </Card>
                {/* Right Column - Image */}
                <div className="flex items-center justify-center">
                    <div className="rounded-lg w-full h-[400px] overflow-hidden">
                        <img
                            src="/images/BloodInfo/BloodComposition.webp"
                            alt="Blood donation and components"
                            className="w-full h-full object-cover"
                        />          </div>
                </div>
            </div>

            <Separator className="my-10" />

            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-6 text-center">Thông Tin Chi Tiết Về Các Thành Phần Máu</h2>

                <Tabs defaultValue="whole-blood" className="w-full">
                    <TabsList className="grid grid-cols-6 mb-8">
                        <TabsTrigger value="whole-blood">Máu Toàn Phần</TabsTrigger>
                        <TabsTrigger value="red-cells">Hồng Cầu</TabsTrigger>
                        <TabsTrigger value="platelets">Tiểu Cầu</TabsTrigger>
                        <TabsTrigger value="plasma">Huyết Tương</TabsTrigger>
                        <TabsTrigger value="cryo">Tủa Lạnh</TabsTrigger>
                        <TabsTrigger value="white-cells">Bạch Cầu</TabsTrigger>
                    </TabsList>

                    <TabsContent value="whole-blood" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Máu Toàn Phần</h3>
                            <p>Chứa hồng cầu, bạch cầu và tiểu cầu (~45% thể tích) lơ lửng trong huyết tương (~55% thể tích).</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Màu sắc:</span> Đỏ</li>
                                <li><span className="font-medium">Thời hạn sử dụng:</span> 21/35 ngày*</li>
                                <li><span className="font-medium">Điều kiện bảo quản:</span> Làm lạnh</li>
                                <li><span className="font-medium">Công dụng chính:</span> Chấn thương, Phẫu thuật</li>
                            </ul>

                            <p>Máu toàn phần là loại hiến máu đơn giản và phổ biến nhất. Nó cũng linh hoạt nhất vì có thể được truyền nguyên dạng, hoặc được dùng để giúp nhiều người khi được tách thành các thành phần cụ thể như hồng cầu, huyết tương và tiểu cầu.</p>

                            <p>Máu toàn phần cần xử lý tối thiểu trước khi sẵn sàng được truyền cho bệnh nhân. Nếu không cần ngay, máu toàn phần có thể được làm lạnh đến 35 ngày, tùy thuộc vào loại chất chống đông được sử dụng.</p>

                            <p>Máu toàn phần được sử dụng để điều trị cho bệnh nhân cần tất cả các thành phần của máu, chẳng hạn như những người bị mất máu đáng kể do chấn thương hoặc phẫu thuật.</p>

                            <p className="text-sm text-muted-foreground italic mt-4">* Thời hạn sử dụng của máu toàn phần thay đổi tùy theo loại chất chống đông được sử dụng.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="red-cells" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Hồng Cầu</h3>
                            <p>(RBCs), hay hồng cầu, tạo nên màu sắc đặc trưng của máu. Được sản xuất trong tủy xương, chúng vận chuyển oxy từ phổi đến các bộ phận khác trong cơ thể và đưa carbon dioxide trở lại phổi để thải ra. Có khoảng một tỷ hồng cầu trong hai đến ba giọt máu.</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Màu sắc:</span> Đỏ</li>
                                <li><span className="font-medium">Thời hạn sử dụng:</span> Lên đến 42 ngày*</li>
                                <li><span className="font-medium">Điều kiện bảo quản:</span> Làm lạnh</li>
                                <li><span className="font-medium">Công dụng chính:</span> Chấn thương, Phẫu thuật, Thiếu máu, Mất máu, Rối loạn máu như hồng cầu hình liềm</li>
                            </ul>

                            <p>Hồng cầu được chuẩn bị từ máu toàn phần bằng cách loại bỏ huyết tương (phần lỏng của máu). Chúng có thời hạn sử dụng lên đến 42 ngày, tùy thuộc vào loại chất chống đông được sử dụng. Chúng cũng có thể được xử lý và đông lạnh trong 10 năm hoặc lâu hơn.</p>

                            <p>Hồng cầu được dùng để điều trị thiếu máu mà không làm tăng đáng kể thể tích máu của bệnh nhân. Những bệnh nhân được hưởng lợi nhiều nhất từ việc truyền hồng cầu bao gồm những người bị thiếu máu mãn tính do suy thận hoặc chảy máu đường tiêu hóa, và những người bị mất máu cấp tính do chấn thương. Chúng cũng có thể được sử dụng để điều trị các rối loạn máu như bệnh hồng cầu hình liềm.</p>

                            <h4 className="text-lg font-medium mt-6">Hồng Cầu Giảm Bạch Cầu Trước Bảo Quản</h4>
                            <p>Hồng cầu giảm bạch cầu được chuẩn bị bằng cách loại bỏ bạch cầu thông qua lọc ngay sau khi hiến máu. Điều này được thực hiện trước khi bảo quản hồng cầu vì theo thời gian, bạch cầu có thể bị phân mảnh, xuống cấp và giải phóng các cytokine, có thể gây ra phản ứng tiêu cực ở bệnh nhân nhận máu. Những phản ứng này có thể xảy ra trong quá trình truyền máu ban đầu hoặc trong bất kỳ lần truyền máu nào trong tương lai.</p>

                            <h4 className="text-lg font-medium mt-6">Hiến Tặng Hồng Cầu</h4>
                            <p>Hội Chữ Thập Đỏ gọi việc hiến tặng hồng cầu là "Power Red" (Sức mạnh đỏ). Bằng cách hiến tặng Power Red, bạn tăng gấp đôi tác động của mình bằng cách đóng góp hai đơn vị hồng cầu trong chỉ một lần hiến máu.</p>

                            <p className="text-sm text-muted-foreground italic mt-4">* Thời hạn sử dụng của hồng cầu thay đổi tùy theo loại chất chống đông được sử dụng.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="platelets" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Tiểu Cầu</h3>
                            <p>Tiểu cầu, hay tiểu huyết cầu, là những mảnh tế bào nhỏ, không màu trong máu của chúng ta, có chức năng chính là bám vào lớp lót của các mạch máu và giúp ngừng hoặc ngăn chặn chảy máu. Tiểu cầu được tạo ra trong tủy xương của chúng ta.</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Màu sắc:</span> Không màu</li>
                                <li><span className="font-medium">Thời hạn sử dụng:</span> 5 ngày</li>
                                <li><span className="font-medium">Điều kiện bảo quản:</span> Nhiệt độ phòng với khuấy động liên tục để ngăn vón cục</li>
                                <li><span className="font-medium">Công dụng chính:</span> Điều trị ung thư, Cấy ghép nội tạng, Phẫu thuật</li>
                            </ul>

                            <p>Tiểu cầu có thể được chuẩn bị bằng cách sử dụng máy li tâm để tách huyết tương giàu tiểu cầu từ máu toàn phần đã hiến tặng. Tiểu cầu từ một số người hiến máu khác nhau sau đó được kết hợp để tạo thành một đơn vị có thể truyền. Một cách khác, tiểu cầu có thể được lấy bằng máy tách thành phần máu, máy này lấy máu từ tay của người hiến máu, tách máu thành các thành phần, giữ lại một số tiểu cầu và trả lại phần máu còn lại cho người hiến máu. Sử dụng quy trình này, một người hiến máu có thể đóng góp khoảng bốn đến sáu lần lượng tiểu cầu nhiều hơn so với một đơn vị tiểu cầu từ máu toàn phần.</p>

                            <p>Tiểu cầu được bảo quản ở nhiệt độ phòng lên đến 5 ngày. Chúng phải nhận được sự khuấy động nhẹ nhàng liên tục để ngăn chặn chúng vón cục.</p>

                            <p>Tiểu cầu thường được sử dụng nhiều nhất trong điều trị ung thư cũng như các quy trình phẫu thuật như cấy ghép nội tạng, để điều trị một tình trạng gọi là giảm tiểu cầu, trong đó có sự thiếu hụt tiểu cầu. Chúng cũng được sử dụng để điều trị các bất thường chức năng tiểu cầu.</p>

                            <h4 className="text-lg font-medium mt-6">Hiến Tặng Tiểu Cầu</h4>
                            <p>Vì tiểu cầu phải được sử dụng trong vòng 5 ngày sau khi hiến tặng, nên luôn có nhu cầu liên tục về người hiến tiểu cầu.</p>

                        </div>
                    </TabsContent>
                    <TabsContent value="plasma" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Huyết Tương</h3>
                            <p>Huyết tương là phần lỏng của máu; hồng cầu, bạch cầu và tiểu cầu của chúng ta lơ lửng trong huyết tương khi chúng di chuyển trong cơ thể.</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Màu sắc:</span> Hơi vàng</li>
                                <li><span className="font-medium">Thời hạn sử dụng:</span> 1 năm</li>
                                <li><span className="font-medium">Điều kiện bảo quản:</span> Đông lạnh</li>
                                <li><span className="font-medium">Công dụng chính:</span> Bệnh nhân bỏng, Sốc, Rối loạn chảy máu</li>
                            </ul>

                            <p>Huyết tương đảm nhiệm nhiều chức năng quan trọng trong cơ thể chúng ta, mặc dù chứa khoảng 92% là nước. (Huyết tương cũng chứa 7% protein thiết yếu như albumin, gamma globulin, yếu tố chống hemophilic, và 1% muối khoáng, đường, chất béo, hormone và vitamin.) Nó giúp chúng ta duy trì huyết áp và thể tích máu ổn định, cung cấp protein quan trọng cho quá trình đông máu và miễn dịch. Nó cũng vận chuyển các chất điện giải như natri và kali đến cơ bắp và giúp duy trì cân bằng pH (acid-base) thích hợp trong cơ thể, điều này rất quan trọng cho chức năng tế bào.</p>

                            <p>Huyết tương được thu nhận bằng cách tách phần lỏng của máu khỏi các tế bào. Huyết tương được đông lạnh trong vòng 24 giờ sau khi hiến tặng để bảo tồn các yếu tố đông máu quý giá. Sau đó, nó được lưu trữ lên đến một năm và được rã đông khi cần thiết.</p>

                            <p>Huyết tương thường được truyền cho bệnh nhân chấn thương, bỏng và sốc, cũng như người bị bệnh gan nặng hoặc thiếu nhiều yếu tố đông máu.</p>

                            <h4 className="text-lg font-medium mt-6">Các Dẫn Xuất Huyết Tương</h4>
                            <p>Trong một số trường hợp, bệnh nhân cần các dẫn xuất huyết tương thay thế. Đây là những chất cô đặc của các protein huyết tương cụ thể thu được thông qua quá trình được gọi là phân đoạn. Các dẫn xuất được xử lý bằng nhiệt và/hoặc chất tẩy rửa dung môi để tiêu diệt một số virus nhất định như những virus gây ra HIV, viêm gan B và viêm gan C.</p>

                            <p>Các dẫn xuất huyết tương bao gồm:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Yếu tố VIII cô đặc</li>
                                <li>Yếu tố IX cô đặc</li>
                                <li>Phức hợp đông máu kháng ức chế (AICC)</li>
                                <li>Albumin</li>
                                <li>Globulin miễn dịch, bao gồm Globulin miễn dịch Rh</li>
                                <li>Anti-Thrombin III cô đặc</li>
                                <li>Alpha 1-Proteinase Inhibitor cô đặc</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-6">Hiến Tặng Huyết Tương AB</h4>
                            <p>Khi thu thập huyết tương cụ thể, Hội Chữ Thập Đỏ đang tìm kiếm người hiến máu nhóm AB. Huyết tương AB chỉ được thu thập tại các Trung tâm Hiến máu Chữ Thập Đỏ được chọn.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="cryo" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Yếu Tố Kháng Hemophilic Tủa Lạnh</h3>
                            <p>(Cryo) là một phần của huyết tương giàu các yếu tố đông máu, bao gồm Yếu tố VIII và fibrinogen. Những yếu tố đông máu này làm giảm mất máu bằng cách giúp làm chậm hoặc ngừng chảy máu do bệnh tật hoặc chấn thương.</p>
                            
                            <ul className="space-y-2">
                                <li><span className="font-medium">Màu sắc:</span> Trắng</li>
                                <li><span className="font-medium">Thời hạn sử dụng:</span> 1 năm</li>
                                <li><span className="font-medium">Điều kiện bảo quản:</span> Đông lạnh</li>
                                <li><span className="font-medium">Công dụng chính:</span> Bệnh hemophilia, Bệnh Von Willebrand (bất thường đông máu di truyền phổ biến nhất), Nguồn Fibrinogen phong phú</li>
                            </ul>
                            
                            <p>Cryo được chuẩn bị bằng cách đông lạnh và sau đó rã đông từ từ huyết tương đông lạnh. Phần tủa được thu thập và sau đó được gộp chung với đóng góp từ những người hiến máu khác để đạt đến thể tích đủ để truyền. Nó có thể được bảo quản, đông lạnh, lên đến một năm.</p>
                            
                            <p>Cryo được sử dụng để ngăn ngừa hoặc kiểm soát chảy máu ở những người mà máu của họ không đông đúng cách. Điều này bao gồm bệnh nhân với các tình trạng di truyền như bệnh hemophilia và bệnh von Willebrand. Cryo cũng là nguồn fibrinogen cho bệnh nhân không thể tự sản xuất lượng protein đông máu quan trọng này.</p>
                            
                            <h4 className="text-lg font-medium mt-6">Hiến Tặng AHF Tủa Lạnh</h4>
                            <p>Cryo được chuẩn bị từ huyết tương đã hiến tặng.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="white-cells" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Bạch Cầu & Bạch Cầu Hạt</h3>
                            <p>Bạch cầu, hoặc leukocyte, là một trong những hệ thống phòng vệ của cơ thể chống lại bệnh tật: một số tiêu diệt vi khuẩn và số khác tạo ra kháng thể chống lại vi khuẩn và virus hoặc chống lại bệnh ác tính. Nhưng trong khi bạch cầu của chính chúng ta giúp chúng ta khỏe mạnh, chúng có thể nguy hiểm đối với người nhận máu hiến tặng. Đó là vì bạch cầu có thể mang virus gây ức chế miễn dịch và giải phóng các chất độc hại trong người nhận. Để tránh những phản ứng tiêu cực này, bạch cầu thường được loại bỏ khỏi các thành phần máu có thể truyền, một quá trình gọi là giảm bạch cầu.</p>
                            
                            <h4 className="text-lg font-medium mt-6">Bạch Cầu Hạt</h4>
                            <p>Điều đó không nhất thiết có nghĩa là bạch cầu của bạn không thể được sử dụng để giúp bệnh nhân cần! Bạch cầu hạt là một loại tế bào bạch cầu bảo vệ chống nhiễm trùng bằng cách bao quanh và tiêu diệt vi khuẩn và virus xâm nhập. Chúng có thể được sử dụng để điều trị nhiễm trùng không đáp ứng với kháng sinh. Bạch cầu hạt được thu thập bằng một quy trình tự động gọi là tách thành phần máu và phải được truyền vào bệnh nhân trong vòng 24 giờ sau khi hiến tặng.</p>
                            
                            <h4 className="text-lg font-medium mt-6">Hiến Tặng Bạch Cầu Hạt</h4>
                            <p>Vì bạch cầu hạt phải được sử dụng trong vòng 24 giờ, việc hiến tặng được thực hiện theo nhu cầu. Để đủ điều kiện hiến tặng bạch cầu hạt, bạn phải đã hiến tặng tiểu cầu thông qua Hội Chữ Thập Đỏ trong vòng 30 ngày.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default BloodComponents;