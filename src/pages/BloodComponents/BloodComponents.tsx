import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BloodComponents = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary md:text-4xl">Blood Components</h1>
                <p className="text-muted-foreground mt-2">
                    Understanding the vital elements of blood and their role in transfusion
                </p>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Text Content */}
                <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                        <h2 className="text-2xl font-semibold mb-4">What are Blood Components?</h2>
                        <p className="text-base mb-4">
                            Blood components are the separate parts that make up whole blood. When you donate blood,
                            it can be separated into these components, allowing one donation to potentially help multiple patients
                            with specific medical needs.
                        </p>
                        <h3 className="text-xl font-medium mb-2">Main Blood Components:</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>
                                <strong className="text-primary">Red Blood Cells</strong> - Carry oxygen from the lungs to the rest of the body
                            </li>
                            <li>
                                <strong className="text-primary">Platelets</strong> - Help blood clot and prevent excessive bleeding
                            </li>
                            <li>
                                <strong className="text-primary">Plasma</strong> - The liquid portion of blood that contains proteins and helps maintain blood pressure
                            </li>
                            <li>
                                <strong className="text-primary">White Blood Cells</strong> - Fight infections and diseases
                            </li>
                        </ul>
                        <p className="text-base">
                            Each component serves a unique and critical function in the human body. By donating blood, you're providing
                            essential components that can be used in different medical treatments and emergency situations.
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
                <h2 className="text-2xl font-semibold mb-6 text-center">Detailed Blood Component Information</h2>

                <Tabs defaultValue="whole-blood" className="w-full">
                    <TabsList className="grid grid-cols-6 mb-8">
                        <TabsTrigger value="whole-blood">Whole Blood</TabsTrigger>
                        <TabsTrigger value="red-cells">Red Cells</TabsTrigger>
                        <TabsTrigger value="platelets">Platelets</TabsTrigger>
                        <TabsTrigger value="plasma">Plasma</TabsTrigger>
                        <TabsTrigger value="cryo">Cryo</TabsTrigger>
                        <TabsTrigger value="white-cells">White Cells </TabsTrigger>
                    </TabsList>

                    <TabsContent value="whole-blood" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Whole Blood</h3>
                            <p>Contains red cells, white cells, and platelets (~45% of volume) suspended in blood plasma (~55% of volume).</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Color:</span> Red</li>
                                <li><span className="font-medium">Shelf Life:</span> 21/35 days*</li>
                                <li><span className="font-medium">Storage Conditions:</span> Refrigerated</li>
                                <li><span className="font-medium">Key Uses:</span> Trauma, Surgery</li>
                            </ul>

                            <p>Whole Blood is the simplest, most common type of blood donation. It's also the most flexible because it can be transfused in its original form, or used to help multiple people when separated into its specific components of red cells, plasma and platelets.</p>

                            <p>A whole blood donation requires minimal processing before it is ready to be transfused into a patient. If not needed right away, whole blood can be refrigerated for up to 35 days, depending on the type of anticoagulant used.</p>

                            <p>Whole blood is used to treat patients who need all the components of blood, such as those who have sustained significant blood loss due to trauma or surgery.</p>

                            <p className="text-sm text-muted-foreground italic mt-4">* Shelf life of whole blood varies based on the type anticoagulant used.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="red-cells" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Red Blood Cells</h3>
                            <p>(RBCs), or erythrocytes, give blood its distinctive color. Produced in our bone marrow, they carry oxygen from our lungs to the rest of our bodies and take carbon dioxide back to our lungs to be exhaled. There are about one billion red blood cells in two to three drops of blood.</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Color:</span> Red</li>
                                <li><span className="font-medium">Shelf Life:</span> Up to 42 days*</li>
                                <li><span className="font-medium">Storage Conditions:</span> Refrigerated</li>
                                <li><span className="font-medium">Key Uses:</span> Trauma, Surgery, Anemia, Any blood loss, Blood disorders such as sickle cell</li>
                            </ul>

                            <p>Red blood cells are prepared from whole blood by removing the plasma (the liquid portion of the blood). They have a shelf life of up to 42 days, depending on the type of anticoagulant used. They can also be treated and frozen for 10 years or more.</p>

                            <p>RBCs are used to treat anemia without substantially increasing the patient's blood volume. Patients who benefit most from transfusion of red blood cells include those with chronic anemia resulting from kidney failure or gastrointestinal bleeding, and those with acute blood loss resulting from trauma. They can also be used to treat blood disorders such as sickle cell disease.</p>

                            <h4 className="text-lg font-medium mt-6">Prestorage Leukocyte-Reduced Red Blood Cells</h4>
                            <p>Leukocyte-reduced RBCs are prepared by removing leukocytes (white blood cells) by filtration shortly after donation. This is done before the RBCs are stored because over time the leukocytes can fragment, deteriorate, and release cytokines, which can trigger negative reactions in the patient who receives them. These reactions can occur during the initial transfusion or during any future transfusions.</p>

                            <h4 className="text-lg font-medium mt-6">Donating Red Blood Cells</h4>
                            <p>The Red Cross calls RBC donations "Power Red." By donating Power Red, you double your impact by contributing two units of red cells in just one donation.</p>

                            <p className="text-sm text-muted-foreground italic mt-4">* Shelf life of red cells varies based on the type anticoagulant used.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="platelets" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Platelets</h3>
                            <p>Platelets, or thrombocytes, are small, colorless cell fragments in our blood whose main function is to stick to the lining of blood vessels and help stop or prevent bleeding. Platelets are made in our bone marrow.</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Color:</span> Colorless</li>
                                <li><span className="font-medium">Shelf Life:</span> 5 days</li>
                                <li><span className="font-medium">Storage Conditions:</span> Room temperature with constant agitation to prevent clumping</li>
                                <li><span className="font-medium">Key Uses:</span> Cancer treatments, Organ transplants, Surgery</li>
                            </ul>

                            <p>Platelets can be prepared by using a centrifuge to separate the platelet-rich plasma from donated whole blood. Platelets from several different donors are then combined to make one transfusable unit. Alternately, platelets can be obtained using an apheresis machine which draws blood from the donor's arm, separates the blood into its components, retains some of the platelets, and returns the remainder of the blood to the donor. Using this process, one donor can contribute about four to six times as many platelets as a unit of platelets obtained from a whole blood donation.</p>

                            <p>Platelets are stored at room temperature for up to 5 days. They must receive constant gentle agitation to prevent them from clumping.</p>

                            <p>Platelets are most often used during cancer treatment as well as surgical procedures such as organ transplant, in order to treat a condition called thrombocytopenia, in which there is a shortage of platelets. They are also used to treat platelet function abnormalities.</p>

                            <h4 className="text-lg font-medium mt-6">Donating Platelets</h4>
                            <p>Since platelets must be used within 5 days of donation, there is a constant need for platelet donors.</p>

                        </div>
                    </TabsContent>
                    <TabsContent value="plasma" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Plasma</h3>
                            <p>Plasma is the liquid portion of blood; our red and white blood cells and platelets are suspended in plasma as they move throughout our bodies.</p>

                            <ul className="space-y-2">
                                <li><span className="font-medium">Color:</span> Yellowish</li>
                                <li><span className="font-medium">Shelf Life:</span> 1 year</li>
                                <li><span className="font-medium">Storage Conditions:</span> Frozen</li>
                                <li><span className="font-medium">Key Uses:</span> Burn patients, Shock, Bleeding disorders</li>
                            </ul>

                            <p>Blood plasma serves several important functions in our bodies, despite being about 92% water. (Plasma also contains 7% vital proteins such as albumin, gamma globulin, anti-hemophilic factor, and 1% mineral salts, sugars, fats, hormones and vitamins.) It helps us maintain a satisfactory blood pressure and volume, and supplies critical proteins for blood clotting and immunity. It also carries electrolytes such as sodium and potassium to our muscles and helps to maintain a proper pH (acid-base) balance in the body, which is critical to cell function.</p>

                            <p>Plasma is obtained by separating the liquid portion of blood from the cells. Plasma is frozen within 24 hours of being donated in order to preserve the valuable clotting factors. It is then stored for up to one year, and thawed when needed.</p>

                            <p>Plasma is commonly transfused to trauma, burn and shock patients, as well as people with severe liver disease or multiple clotting factor deficiencies.</p>

                            <h4 className="text-lg font-medium mt-6">Plasma Derivatives</h4>
                            <p>In some cases, patients need plasma derivatives instead. These are concentrates of specific plasma proteins obtained through a process known as fractionation. The derivatives are treated with heat and/or solvent detergent to kill certain viruses like those that cause HIV, hepatitis B, and hepatitis C.</p>

                            <p>Plasma derivatives include:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Factor VIII Concentrate</li>
                                <li>Factor IX Concentrate</li>
                                <li>Anti-Inhibitor Coagulation Complex (AICC)</li>
                                <li>Albumin</li>
                                <li>Immune Globulins, including Rh Immune Globulin</li>
                                <li>Anti-Thrombin III Concentrate</li>
                                <li>Alpha 1-Proteinase Inhibitor Concentrate</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-6">Donating AB Plasma</h4>
                            <p>When collecting specifically plasma, the Red Cross is seeking AB-type donors. AB plasma is collected at select Red Cross Donation Centers only.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="cryo" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">Cryoprecipitated Antihemophilic Factor</h3>
                            <p>(Cryo) is a portion of plasma rich in clotting factors, including Factor VIII and fibrinogen. These clotting factors reduce blood loss by helping to slow or stop bleeding due to illness or injury.</p>
                            
                            <ul className="space-y-2">
                                <li><span className="font-medium">Color:</span> White</li>
                                <li><span className="font-medium">Shelf Life:</span> 1 year</li>
                                <li><span className="font-medium">Storage Conditions:</span> Frozen</li>
                                <li><span className="font-medium">Key Uses:</span> Hemophilia, Von Willebrand disease (most common hereditary coagulation abnormality), Rich source of Fibrinogen</li>
                            </ul>
                            
                            <p>Cryo is prepared by freezing and then slowly thawing frozen plasma. The precipitate is collected and then pooled with contributions from other donors to reach a sufficient volume for transfusion. It can be stored, frozen, for up to a year.</p>
                            
                            <p>Cryo is used to prevent or control bleeding in people whose own blood does not clot properly. This includes patients with hereditary conditions such as hemophilia and von Willebrands disease. Cryo is also a source of fibrinogen for patients who cannot produce the necessary amount of this important clotting protein on their own.</p>
                            
                            <h4 className="text-lg font-medium mt-6">Donating Cryoprecipitated AHF</h4>
                            <p>Cryo is prepared from donated plasma.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="white-cells" className="border rounded-lg p-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-primary">White Blood Cells & Granulocytes</h3>
                            <p>White blood cells, or leukocytes, are one of the body's defenses against disease: some destroy bacteria and others create antibodies against bacteria and viruses or fight malignant disease. But while our own white cells help us stay healthy, they can be dangerous to someone who receives donated blood. That's because leukocytes may carry viruses that cause immune suppression and release toxic substances in the recipient. To avoid these negative reactions, leukocytes are often removed from transfusable blood components, a process called leuko-reduction.</p>
                            
                            <h4 className="text-lg font-medium mt-6">Granulocytes</h4>
                            <p>That doesn't necessarily mean your white cells can't be used to help patients in need! Granulocytes are a type of white cell that protects against infection by surrounding and destroying invading bacteria and viruses. They can be used to treat infections that don't respond to antibiotics. Granulocytes are collected by an automated process called apheresis and must be transfused into the patient within 24 hours of being donated.</p>
                            
                            <h4 className="text-lg font-medium mt-6">Donating Granulocytes</h4>
                            <p>Since granulocyte must be used within 24 hours, donations are taken on an as-needed basis. To be eligible to donate granulocytes, you must have donated platelets through the Red Cross within 30 days.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default BloodComponents;