import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Blood type data
const bloodTypes = {
  A: {
    name: 'Nhóm A',
    description: 'chỉ có kháng nguyên A trên hồng cầu (và kháng thể B trong huyết tương)',
    redCellsHeight: 60,
    plasmaHeight: 40,
    antigens: ['A'],
    antibodies: ['B'],
    canDonateTo: ['A', 'AB'],
    canReceiveFrom: ['A', 'O']
  },
  B: {
    name: 'Nhóm B',
    description: 'chỉ có kháng nguyên B trên hồng cầu (và kháng thể A trong huyết tương)',
    redCellsHeight: 55,
    plasmaHeight: 45,
    antigens: ['B'],
    antibodies: ['A'],
    canDonateTo: ['B', 'AB'],
    canReceiveFrom: ['B', 'O']
  },
  AB: {
    name: 'Nhóm AB',
    description: 'có cả kháng nguyên A và B trên hồng cầu (nhưng không có kháng thể A hoặc B nào trong huyết tương)',
    redCellsHeight: 65,
    plasmaHeight: 35,
    antigens: ['A', 'B'],
    antibodies: [],
    canDonateTo: ['AB'],
    canReceiveFrom: ['A', 'B', 'AB', 'O']
  },
  O: {
    name: 'Nhóm O',
    description: 'không có kháng nguyên A hoặc B nào trên hồng cầu (nhưng có cả kháng thể A và B trong huyết tương)',
    redCellsHeight: 50,
    plasmaHeight: 50,
    antigens: [],
    antibodies: ['A', 'B'],
    canDonateTo: ['A', 'B', 'AB', 'O'],
    canReceiveFrom: ['O']
  }
};

// Blood Type Button Component
const BloodTypeButton = ({ type, isActive, onClick }) => (
  <Button
    variant={isActive ? "default" : "outline"}
    onClick={() => onClick(type)}
    className={`w-3/4  py-6 text-base font-semibold rounded-full transition-all duration-300 ${isActive
      ? 'bg-primary text-primary-foreground shadow-md'
      : 'border-primary/30 hover:border-primary/70 text-foreground'
      }`}
    size="lg"
  >
    Nhóm {type}
  </Button>
);

// Test Tube Component
const TestTube = ({ bloodType }) => {
  const data = bloodTypes[bloodType];

  return (
    <div className="relative flex flex-col items-center">
      {/* Test Tube Container */}
      <div className="relative w-24 h-80 bg-secondary rounded-t-lg border-4 border-secondary/70 overflow-hidden shadow-lg">
        {/* Test Tube Neck */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-secondary border-4 border-secondary/70 rounded-t-lg -mt-2"></div>

        {/* Plasma (Yellow) */}
        <motion.div
          className="absolute top-0 w-full bg-chart-4 flex items-center justify-center gap-2"
          initial={{ height: 0 }}
          animate={{ height: `${data.plasmaHeight}%` }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          style={{ zIndex: 2 }}
        >
          {data.antibodies.length > 0 ? (
            data.antibodies.map((antibody, index) => (
              <motion.div
                key={antibody}
                className="bg-background rounded-full w-8 h-8 flex items-center justify-center font-bold text-foreground border-2 border-border shadow-md"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.8 + (index * 0.2) }}
              >
                {antibody}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="bg-background rounded-full w-8 h-8 flex items-center justify-center font-bold text-foreground border-2 border-border shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              ∅
            </motion.div>
          )}
          <div className="absolute top-2 right-2 text-xs font-semibold text-background">
            HUYẾT TƯƠNG
          </div>
        </motion.div>

        {/* Red Blood Cells (Red) */}
        <motion.div
          className="absolute bottom-0 w-full bg-primary flex items-center justify-center gap-2"
          initial={{ height: 0 }}
          animate={{ height: `${data.redCellsHeight}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ zIndex: 1 }}
        >
          {data.antigens.length > 0 ? (
            data.antigens.map((antigen, index) => (
              <motion.div
                key={antigen}
                className="bg-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-background border-2 border-border shadow-md"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + (index * 0.2) }}
              >
                {antigen}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="bg-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-background border-2 border-border shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              ∅
            </motion.div>
          )}
          <div className="absolute bottom-2 right-2 text-xs font-semibold text-primary-foreground">
            HỒNG CẦU
          </div>
        </motion.div>

        {/* Animated Bubbles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-background bg-opacity-30 rounded-full"
              animate={{
                y: [-10, -300],
                x: [Math.random() * 60, Math.random() * 60],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                bottom: '20%'
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Test Tube Base */}
      <div className="w-32 h-4 bg-secondary/80 rounded-b-full border-4 border-secondary shadow-lg"></div>
    </div>
  );
};

// Information Panel Component
const InformationPanel = ({ bloodType }) => {
  const data = bloodTypes[bloodType];

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="pb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <CardTitle className="text-2xl font-bold">{data.name}</CardTitle>
          <CardDescription className="text-base">Thành phần máu</CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent>
        <motion.p
          className="text-foreground text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Nhóm máu này {data.description}.
        </motion.p>

        <Tabs defaultValue="composition" className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="composition" className="flex-1">Thành Phần</TabsTrigger>
            <TabsTrigger value="compatibility" className="flex-1">Khả Năng Tương Thích</TabsTrigger>
          </TabsList>

          <TabsContent value="composition" className="mt-4">
            <motion.div
              className="p-4 bg-accent/10 rounded-lg border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-muted-foreground">Kháng nguyên:</span>
                  <div className="flex gap-2 mt-1">
                    {data.antigens.length > 0 ? data.antigens.map(antigen => (
                      <Badge key={antigen} variant="secondary" className="bg-primary text-primary-foreground">
                        {antigen}
                      </Badge>
                    )) : (
                      <Badge variant="outline">Không có</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Kháng thể:</span>
                  <div className="flex gap-2 mt-1">
                    {data.antibodies.length > 0 ? data.antibodies.map(antibody => (
                      <Badge key={antibody} variant="secondary" className="bg-chart-4 text-accent-foreground">
                        {antibody}
                      </Badge>
                    )) : (
                      <Badge variant="outline">Không có</Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="compatibility" className="mt-4">
            <motion.div
              className="p-4 bg-accent/10 rounded-lg border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-muted-foreground">Có thể hiến cho:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.canDonateTo.map(type => (
                      <Badge key={type} variant="outline" className="border-primary">
                        Nhóm {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Có thể nhận từ:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.canReceiveFrom.map(type => (
                      <Badge key={type} variant="outline" className="border-primary">
                        Nhóm {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {bloodType === 'O' && (
                <div className="mt-3 p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm text-center">
                    Nhóm O được biết đến là người hiến máu vạn năng.
                  </p>
                </div>
              )}

              {bloodType === 'AB' && (
                <div className="mt-3 p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm text-center">
                    Nhóm AB được biết đến là người nhận máu vạn năng.
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col items-start">
        <h3 className="font-semibold mb-2">Thông Tin Nhanh</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>
            {bloodType === 'O' ? 'Nhóm máu được yêu cầu nhiều nhất' :
              bloodType === 'AB' ? 'Nhóm máu hiếm nhất (~4% dân số)' :
                bloodType === 'A' ? 'Nhóm máu phổ biến thứ hai' :
                  'Nhóm máu phổ biến thứ ba'}
          </li>
          <li>
            Được xác định bởi kháng nguyên trên hồng cầu
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
};

// Main App Component
const BloodTypeInterface = () => {
  const [selectedBloodType, setSelectedBloodType] = useState('A');

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-center mb-6 text-primary">Nhóm Máu Được Xác Định Như Thế Nào Và Tại Sao Bạn Cần Biết</h1>

          <motion.div
            className="mt-6 mb-8 bg-accent/5 p-5 rounded-lg border border-accent/10 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-foreground text-lg leading-relaxed">
              Nhóm máu được xác định bởi sự hiện diện hoặc vắng mặt của các kháng nguyên – các chất có thể kích hoạt phản ứng miễn dịch nếu chúng là lạ đối với cơ thể. Vì một số kháng nguyên có thể kích hoạt hệ miễn dịch của bệnh nhân tấn công máu được truyền, các ca truyền máu an toàn phụ thuộc vào việc xác định nhóm máu và kiểm tra chéo cẩn thận.
            </p>
            <p className="mt-3 font-semibold text-lg text-primary">
              Bạn có biết nhóm máu nào an toàn cho bạn nếu bạn cần truyền máu không?
            </p>
            <p className="text-foreground text-lg leading-relaxed">
              Có bốn nhóm máu chính được xác định bởi sự hiện diện hoặc vắng mặt của hai kháng nguyên, A và B, trên bề mặt của hồng cầu. Ngoài kháng nguyên A và B, có một protein gọi là yếu tố Rh, có thể hiện diện (+) hoặc vắng mặt (–), tạo ra 8 nhóm máu phổ biến nhất (A+, A-, B+, B-, O+, O-, AB+, AB-).
            </p>
          </motion.div>

          <p className="mt-4 text-muted-foreground">
            Nhấp vào một nhóm máu bên dưới để tìm hiểu về thành phần và tính tương thích của nó.
          </p>
        </motion.div>

        {/* Main Content */}
        <Card className="p-6">
          <CardContent className="p-0 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Blood Type Buttons */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {Object.keys(bloodTypes).map((type) => (
                  <BloodTypeButton
                    key={type}
                    type={type}
                    isActive={selectedBloodType === type}
                    onClick={setSelectedBloodType}
                  />
                ))}
              </motion.div>

              {/* Test Tube */}
              <div className="flex justify-center">
                <AnimatePresence mode="wait">
                  <TestTube
                    key={selectedBloodType}
                    bloodType={selectedBloodType}
                  />
                </AnimatePresence>
              </div>

              {/* Information Panel */}
              <AnimatePresence mode="wait">
                <InformationPanel
                  key={selectedBloodType}
                  bloodType={selectedBloodType}
                />
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BloodTypeInterface;