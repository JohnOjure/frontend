import React from "react";
import { Card, Typography, List, Divider, Tag, Timeline, Row, Col } from "antd";
import {

RobotOutlined,
FileDoneOutlined,
SafetyCertificateOutlined,
PhoneOutlined,
NumberOutlined,
TeamOutlined,
ClockCircleOutlined,
CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const coreFeatures = [
{
    icon: <RobotOutlined style={{ color: "#1890ff" }} />,
    title: "AI Insurance Copilot (Web App)",
    features: [
        {
            name: "Symptom-to-Coverage Engine",
            desc: (
                <>
                    Detects health/life events in chat &rarr; Recommends Curacel policies.<br />
                    <Text type="secondary">
                        Example: "My back pain worsened after farm work" &rarr; "Consider Curacel's Occupational Injury Cover! 60% subsidy for farmers."
                    </Text>
                </>
            ),
        },
        {
            name: "1-Click Claim Filing",
            desc: (
                <>
                    Extracts treatment details from chat/PDF &rarr; Autofills Curacel claim forms.<br />
                    <Text type="secondary">Tech: PyPDF2 + spaCy NLP</Text>
                </>
            ),
        },
        {
            name: "Fraud Shield",
            desc: (
                <>
                    Flags inconsistencies between user messages & medical receipts.<br />
                    <Text type="secondary">
                        Demo: "You said 'malaria test on May 15' but receipt shows May 10 &rarr; clarify?"
                    </Text>
                </>
            ),
        },
    ],
},
{
    icon: <PhoneOutlined style={{ color: "#52c41a" }} />,
    title: "Rural Bridge (USSD/Voice)",
    features: [
        {
            name: "Voice Claims Assistant",
            desc: <>User dials &rarr; "Describe injury..." &rarr; AI files claim via Curacel API.</>,
        },
        {
            name: "USSD Command Sync",
            desc: (
                <>
                    <Text code>*123*POLICY#</Text> &rarr; Lists recommended Curacel policies<br />
                    <Text code>*123*CLAIM#</Text> &rarr; Checks claim status
                </>
            ),
        },
    ],
},
];

const teamRoles = [
"AI Dev (Open Ai + NLP)",
"Curacel API (Grow/Health endpoints)",
"Frontend (React dashboard)",
"Backend (Python/FastAPI)",
"Telecom (Africa's Talking API)",
];

const hourlyTasks = [
{
    hour: "1-3",
    deliverables: [
        "Setup Llama 3 + index Curacel docs",
        "Curacel sandbox auth",
        "Chat UI skeleton",
    ],
},
{
    hour: "4-6",
    deliverables: [
        'AI event detector (spaCy): "pain" → GET /products?category=injury',
        "USSD menu: *123* → Policy/Claim options",
    ],
},
{
    hour: "7-9",
    deliverables: [
        "PDF parser for receipts → autofill claim form",
        "Fraud check: Compare chat date vs. receipt date",
        "Voice: Record claim-filing prompts",
    ],
},
{
    hour: "10-12",
    deliverables: [
        "DEMO FLOW:",
        '1. Web: User types "Paid ₦8k for malaria meds at Faith Clinic" → AI files claim',
        '2. USSD: Judge dials *123*CLAIM# → Hears "Claim #CF32 approved! ₦6,500 paid to Faith Clinic."',
    ],
},
];

const demoFlow = [
{
    step: 'User: "Spent ₦15k on malaria care at Hope Clinic"',
    icon: <RobotOutlined />,
},
{
    step: "AI files claim",
    icon: <FileDoneOutlined />,
},
{
    step: "Judge checks status via USSD",
    icon: <PhoneOutlined />,
},
{
    step: 'System: "Claim #HP21 paid ₦12k to Hope Clinic!"',
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
},
];

const techStack = [
{ name: "AI", value: "Llama 3 + spaCy + Hugging Face" },
{ name: "APIs", value: "Curacel Grow/Health, Africa's Talking" },
{ name: "Web", value: "React + FastAPI + Firebase" },
];

const App = () => (
<div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
    <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
            <Card>
                <Title level={2}>HEALTHPALM 2.0 Dashboard</Title>
                <Paragraph>
                    <Text strong>Mission:</Text> Transform health conversations into insured actions via AI + Curacel APIs.
                </Paragraph>
                <Divider />
                <Title level={4}>⚡ Core Features</Title>
                <List
                    itemLayout="vertical"
                    dataSource={coreFeatures}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={item.icon}
                                title={<Text strong>{item.title}</Text>}
                            />
                            <List
                                size="small"
                                dataSource={item.features}
                                renderItem={(f) => (
                                    <List.Item>
                                        <Tag color="blue">{f.name}</Tag> {f.desc}
                                    </List.Item>
                                )}
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <Divider />
            <Card>
                <Title level={4}>⏱ 12-Hour MVP Build Plan</Title>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Title level={5}>
                            <TeamOutlined /> Team Roles
                        </Title>
                        <List
                            size="small"
                            dataSource={teamRoles}
                            renderItem={(role) => (
                                <List.Item>
                                    <Tag color="geekblue">{role}</Tag>
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={5}>
                            <ClockCircleOutlined /> Hourly Tasks
                        </Title>
                        <List
                            size="small"
                            dataSource={hourlyTasks}
                            renderItem={(task) => (
                                <List.Item>
                                    <Text strong>Hour {task.hour}:</Text>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                        {task.deliverables.map((d, i) => (
                                            <li key={i}>{d}</li>
                                        ))}
                                    </ul>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Card>
        </Col>
        <Col xs={24} md={8}>
            <Card>
                <Title level={4}>💡 Why This Wins</Title>
                <ul>
                    <li>
                        <Text strong>Solves Curacel’s Pain Points:</Text>
                        <ul>
                            <li>
                                70% of small claims unfiled &rarr; <Text type="success">AI auto-filing</Text>
                            </li>
                            <li>
                                Fraud drains 20% revenue &rarr; <Text type="danger">Real-time discrepancy alerts</Text>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Text strong>Rural &lt;&gt; Web Synergy:</Text> Grandma files claim via voice &rarr; Clinic sees payout in web portal
                    </li>
                    <li>
                        <Text strong>No Payment Negotiation:</Text> Focus stays on <Text underline>insurance access & automation</Text>
                    </li>
                </ul>
            </Card>
            <Divider />
            <Card>
                <Title level={4}>📋 Demo Flow</Title>
                <Timeline>
                    {demoFlow.map((step, idx) => (
                        <Timeline.Item key={idx} dot={step.icon}>
                            {step.step}
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Card>
            <Divider />
            <Card>
                <Title level={4}>🛠 Tech Stack</Title>
                <List
                    size="small"
                    dataSource={techStack}
                    renderItem={(item) => (
                        <List.Item>
                            <Tag color="purple">{item.name}</Tag> {item.value}
                        </List.Item>
                    )}
                />
            </Card>
        </Col>
    </Row>
</div>
);

export default App;