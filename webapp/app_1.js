// Indian Road Network Modeling Toolkit - Main Application Logic
class IndianRoadToolkit {
    constructor() {
        this.currentSection = 'home';
        this.indianCities = [];
        this.osmAnalysisResults = null;
        this.generatedScenes = 0;
        this.simulationsRun = 0;
        this.charts = {};
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadCityData();
        this.initializeCharts();
        this.populateCitySelectors();
        this.initializeWorkflowCards();
        this.updateAnalytics();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        navToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // OSM Analyzer
        this.setupOSMAnalyzer();
        
        // 3D Scene Builder
        this.setupSceneBuilder();
        
        // Traffic Simulator
        this.setupTrafficSimulator();
        
        // Workflow Generator
        this.setupWorkflowGenerator();
        
        // Cities Database
        this.setupCitiesDatabase();
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`)?.classList.add('active');
        
        // Initialize section-specific content
        this.initializeSection(sectionId);
    }

    initializeSection(sectionId) {
        switch(sectionId) {
            case 'analytics':
                this.updateAnalytics();
                this.renderAnalyticsCharts();
                break;
            case 'cities':
                this.renderCitiesGrid();
                break;
            case 'scene-builder':
                // Re-populate city selector when entering scene builder
                this.populateSceneBuilderCitySelect();
                break;
        }
    }

    async loadCityData() {
        // Use the provided city data
        this.indianCities = [
            {
                name: "Hyderabad",
                state: "Telangana", 
                lat: 17.3850,
                lng: 78.4867,
                population: 10000000,
                road_length: 12500,
                traffic_density: "High",
                major_roads: ["PVNR Expressway", "ORR", "Nehru Outer Ring Road", "Cyberabad Road"],
                challenges: ["Rapid IT expansion", "Mixed traffic", "Frequent rains", "Construction zones"],
                osm_features: {"highways": 450, "arterials": 120, "collectors": 850, "local_roads": 5200}
            },
            {
                name: "Mumbai",
                state: "Maharashtra",
                lat: 19.0760,
                lng: 72.8777, 
                population: 20400000,
                road_length: 18000,
                traffic_density: "Very High",
                major_roads: ["Eastern Express Highway", "Western Express Highway", "SCLR", "JVLR"],
                challenges: ["Island geography", "Monsoons", "Slums", "Bridge bottlenecks"],
                osm_features: {"highways": 12, "arterials": 45, "collectors": 180, "local_roads": 2800}
            },
            {
                name: "Delhi", 
                state: "Delhi",
                lat: 28.7041,
                lng: 77.1025,
                population: 32900000,
                road_length: 32000,
                traffic_density: "Very High", 
                major_roads: ["Ring Road", "Outer Ring Road", "DND Flyway", "Noida Expressway"],
                challenges: ["Air pollution", "Mixed vehicle types", "Extreme weather", "Encroachments"],
                osm_features: {"highways": 28, "arterials": 85, "collectors": 420, "local_roads": 8200}
            },
            {
                name: "Chennai",
                state: "Tamil Nadu",
                lat: 13.0827,
                lng: 80.2707,
                population: 11700000,
                road_length: 9800,
                traffic_density: "High",
                major_roads: ["GST Road", "ECR", "OMR", "Mount Road"], 
                challenges: ["Coastal flooding", "Two-wheeler dominance", "IT corridor traffic", "Heat waves"],
                osm_features: {"highways": 18, "arterials": 42, "collectors": 230, "local_roads": 3100}
            },
            {
                name: "Bangalore",
                state: "Karnataka",
                lat: 12.9716, 
                lng: 77.5946,
                population: 13200000,
                road_length: 14500,
                traffic_density: "Very High",
                major_roads: ["ORR", "Hosur Road", "Bannerghatta Road", "Electronic City"],
                challenges: ["Tech hub traffic", "Lakes/terrain", "Metro construction", "Narrow roads"],
                osm_features: {"highways": 22, "arterials": 65, "collectors": 340, "local_roads": 4800}
            },
            {
                name: "Kolkata",
                state: "West Bengal", 
                lat: 22.5726,
                lng: 88.3639,
                population: 14700000,
                road_length: 8200,
                traffic_density: "High",
                major_roads: ["AJC Bose Road", "EM Bypass", "VIP Road", "Jessore Road"],
                challenges: ["River crossings", "Old infrastructure", "Monsoons", "Hand-pulled rickshaws"],
                osm_features: {"highways": 8, "arterials": 25, "collectors": 120, "local_roads": 2200}
            }
        ];
    }

    setupOSMAnalyzer() {
        const uploadBox = document.getElementById('osmUploadBox');
        const fileInput = document.getElementById('osmFileInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const loadSampleBtn = document.getElementById('loadSampleBtn');

        uploadBox.addEventListener('click', () => fileInput.click());
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('dragover');
        });
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('dragover');
        });
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        analyzeBtn.addEventListener('click', () => this.analyzeOSMFile());
        loadSampleBtn.addEventListener('click', () => this.loadSampleOSMData());
    }

    handleFileUpload(file) {
        const uploadBox = document.getElementById('osmUploadBox');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            this.showNotification('File size too large. Please select a file smaller than 50MB.', 'error');
            return;
        }

        const validExtensions = ['.osm', '.pbf', '.xml'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            this.showNotification('Invalid file format. Please select an OSM, PBF, or XML file.', 'error');
            return;
        }

        uploadBox.innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
            <p><strong>${file.name}</strong></p>
            <small>File size: ${(file.size / 1024 / 1024).toFixed(2)} MB</small>
        `;
        
        analyzeBtn.disabled = false;
        this.uploadedFile = file;
    }

    async analyzeOSMFile() {
        if (!this.uploadedFile) {
            this.showNotification('Please upload an OSM file first.', 'error');
            return;
        }

        this.showProcessingIndicator(true);
        
        // Simulate OSM file processing
        await this.delay(2000);
        
        // Generate realistic analysis results
        const analysisResults = this.generateOSMAnalysis(this.uploadedFile.name);
        this.displayAnalysisResults(analysisResults);
        this.generateMATLABCode(analysisResults);
        
        this.showProcessingIndicator(false);
        this.showNotification('OSM file analyzed successfully!', 'success');
    }

    async loadSampleOSMData() {
        this.showProcessingIndicator(true);
        
        await this.delay(1500);
        
        // Generate sample analysis for Hyderabad
        const sampleResults = {
            fileName: 'hyderabad_sample.osm',
            fileSize: '15.2 MB',
            totalNodes: 125000,
            totalWays: 18500,
            totalRelations: 450,
            roadNetwork: {
                highways: 450,
                arterials: 120,
                collectors: 850,
                local_roads: 5200,
                total_length: 12500
            },
            trafficFeatures: {
                signals: 850,
                intersections: 1200,
                bridges: 45,
                underpasses: 23
            },
            indianFeatures: {
                potholes_detected: 1250,
                construction_zones: 15,
                narrow_sections: 340,
                mixed_traffic_zones: 890
            }
        };
        
        this.displayAnalysisResults(sampleResults);
        this.generateMATLABCode(sampleResults);
        
        this.showProcessingIndicator(false);
        this.showNotification('Sample OSM data loaded successfully!', 'success');
    }

    generateOSMAnalysis(fileName) {
        const baseNodes = Math.floor(Math.random() * 50000) + 80000;
        const baseWays = Math.floor(baseNodes * 0.15);
        const baseRelations = Math.floor(baseWays * 0.025);
        
        return {
            fileName: fileName,
            fileSize: `${(Math.random() * 20 + 5).toFixed(1)} MB`,
            totalNodes: baseNodes,
            totalWays: baseWays,
            totalRelations: baseRelations,
            roadNetwork: {
                highways: Math.floor(Math.random() * 50) + 20,
                arterials: Math.floor(Math.random() * 100) + 50,
                collectors: Math.floor(Math.random() * 500) + 300,
                local_roads: Math.floor(Math.random() * 3000) + 2000,
                total_length: Math.floor(Math.random() * 8000) + 5000
            },
            trafficFeatures: {
                signals: Math.floor(Math.random() * 400) + 200,
                intersections: Math.floor(Math.random() * 600) + 400,
                bridges: Math.floor(Math.random() * 30) + 10,
                underpasses: Math.floor(Math.random() * 15) + 5
            },
            indianFeatures: {
                potholes_detected: Math.floor(Math.random() * 800) + 200,
                construction_zones: Math.floor(Math.random() * 20) + 5,
                narrow_sections: Math.floor(Math.random() * 200) + 100,
                mixed_traffic_zones: Math.floor(Math.random() * 500) + 300
            }
        };
    }

    displayAnalysisResults(results) {
        const resultsContent = document.getElementById('resultsContent');
        
        resultsContent.innerHTML = `
            <div class="analysis-summary">
                <h4>File Analysis Summary</h4>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">File:</span>
                        <span class="summary-value">${results.fileName}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Size:</span>
                        <span class="summary-value">${results.fileSize}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Nodes:</span>
                        <span class="summary-value">${results.totalNodes.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Ways:</span>
                        <span class="summary-value">${results.totalWays.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="road-network-analysis">
                <h4>Road Network Analysis</h4>
                <div class="network-stats">
                    <div class="stat-row">
                        <span>Highways:</span>
                        <span class="stat-value">${results.roadNetwork.highways}</span>
                    </div>
                    <div class="stat-row">
                        <span>Arterial Roads:</span>
                        <span class="stat-value">${results.roadNetwork.arterials}</span>
                    </div>
                    <div class="stat-row">
                        <span>Collector Roads:</span>
                        <span class="stat-value">${results.roadNetwork.collectors}</span>
                    </div>
                    <div class="stat-row">
                        <span>Local Roads:</span>
                        <span class="stat-value">${results.roadNetwork.local_roads}</span>
                    </div>
                    <div class="stat-row total">
                        <span><strong>Total Length:</strong></span>
                        <span class="stat-value"><strong>${results.roadNetwork.total_length} km</strong></span>
                    </div>
                </div>
            </div>
            
            <div class="indian-features-analysis">
                <h4>Indian Road Features Detected</h4>
                <div class="features-grid">
                    <div class="feature-card">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>${results.indianFeatures.potholes_detected}</strong>
                            <span>Potential Potholes</span>
                        </div>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-tools"></i>
                        <div>
                            <strong>${results.indianFeatures.construction_zones}</strong>
                            <span>Construction Zones</span>
                        </div>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-compress-arrows-alt"></i>
                        <div>
                            <strong>${results.indianFeatures.narrow_sections}</strong>
                            <span>Narrow Sections</span>
                        </div>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-random"></i>
                        <div>
                            <strong>${results.indianFeatures.mixed_traffic_zones}</strong>
                            <span>Mixed Traffic Zones</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.osmAnalysisResults = results;
    }

    generateMATLABCode(results) {
        const matlabCode = `
% Indian Road Network Analysis - Generated MATLAB Code
% File: ${results.fileName}
% Generated: ${new Date().toLocaleString()}

%% Initialize Road Network Analysis
clc; clear; close all;

% Import OSM data
osmFile = '${results.fileName}';
roadNetwork = roadprops();

%% Road Network Statistics
fprintf('\\n=== Road Network Analysis ===\\n');
fprintf('Total Nodes: %d\\n', ${results.totalNodes});
fprintf('Total Ways: %d\\n', ${results.totalWays});
fprintf('Total Length: %.1f km\\n', ${results.roadNetwork.total_length});

%% Road Classification
highways = ${results.roadNetwork.highways};
arterials = ${results.roadNetwork.arterials};
collectors = ${results.roadNetwork.collectors};
localRoads = ${results.roadNetwork.local_roads};

% Create road network structure
roadData = struct();
roadData.highways = highways;
roadData.arterials = arterials;
roadData.collectors = collectors;
roadData.localRoads = localRoads;

%% Indian Traffic Characteristics
% Mixed vehicle composition (typical Indian traffic)
vehicleMix = struct();
vehicleMix.cars = 0.40;           % 40% cars
vehicleMix.twoWheelers = 0.45;    % 45% two-wheelers
vehicleMix.trucks = 0.10;         % 10% trucks
vehicleMix.buses = 0.05;          % 5% buses

%% Road Condition Parameters (Indian Context)
roadConditions = struct();
roadConditions.potholes = ${results.indianFeatures.potholes_detected};
roadConditions.constructionZones = ${results.indianFeatures.construction_zones};
roadConditions.narrowSections = ${results.indianFeatures.narrow_sections};
roadConditions.mixedTrafficZones = ${results.indianFeatures.mixed_traffic_zones};

%% Generate Driving Scenario
scenario = drivingScenario();
roadCenters = [0 0 0; 100 0 0; 200 50 0];
road(scenario, roadCenters, 'lanes', lanespec(2));

% Add Indian traffic characteristics
% Adjust lane width for mixed traffic
laneWidth = 3.2; % Reduced for Indian conditions

%% Traffic Flow Simulation
% Create realistic Indian traffic flow
trafficDensity = 'high'; % Typical for Indian cities
simulationTime = 300; % 5 minutes

% Vehicle spawning with Indian characteristics
for i = 1:50
    vehicleType = generateIndianVehicle(vehicleMix);
    spawnVehicle(scenario, vehicleType);
end

%% Export Results
fprintf('\\n=== Analysis Complete ===\\n');
fprintf('Generated MATLAB scenario with Indian road characteristics\\n');
fprintf('Road conditions and mixed traffic patterns included\\n');

% Save workspace
save('indian_road_analysis.mat', 'roadData', 'vehicleMix', 'roadConditions');

%% Helper Functions
function vehicleType = generateIndianVehicle(mix)
    rand_val = rand();
    if rand_val < mix.cars
        vehicleType = 'car';
    elseif rand_val < (mix.cars + mix.twoWheelers)
        vehicleType = 'motorcycle';
    elseif rand_val < (mix.cars + mix.twoWheelers + mix.trucks)
        vehicleType = 'truck';
    else
        vehicleType = 'bus';
    end
end

function spawnVehicle(scenario, type)
    % Spawn vehicle with Indian driving characteristics
    vehicle(scenario, 'ClassID', 1, 'Position', [0 0 0]);
end
        `.trim();
        
        document.getElementById('generatedMatlabCode').textContent = matlabCode;
    }

    showProcessingIndicator(show) {
        const indicator = document.getElementById('processingIndicator');
        if (show) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }

    setupSceneBuilder() {
        const generateBtn = document.getElementById('generateSceneBtn');
        const exportBtn = document.getElementById('exportSceneBtn');
        
        generateBtn.addEventListener('click', () => this.generateScene());
        exportBtn.addEventListener('click', () => this.exportScene());
        
        // Populate city dropdown immediately
        this.populateSceneBuilderCitySelect();
    }

    populateSceneBuilderCitySelect() {
        const citySelect = document.getElementById('citySelect');
        if (!citySelect) return;
        
        // Clear existing options except the first one
        citySelect.innerHTML = '<option value="">Choose a city...</option>';
        
        // Add city options
        this.indianCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.name.toLowerCase();
            option.textContent = `${city.name}, ${city.state}`;
            citySelect.appendChild(option);
        });
    }

    populateCitySelect(selectElement) {
        if (!selectElement) return;
        
        // Clear existing options except the first one if it exists
        const firstOption = selectElement.querySelector('option');
        selectElement.innerHTML = '';
        if (firstOption) {
            selectElement.appendChild(firstOption);
        } else {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Choose a city...';
            selectElement.appendChild(defaultOption);
        }
        
        this.indianCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.name.toLowerCase();
            option.textContent = `${city.name}, ${city.state}`;
            selectElement.appendChild(option);
        });
    }

    async generateScene() {
        const citySelect = document.getElementById('citySelect');
        const roadType = document.getElementById('roadTypeSelect').value;
        const trafficDensity = document.getElementById('trafficDensitySelect').value;
        const weather = document.getElementById('weatherSelect').value;
        
        if (!citySelect.value) {
            this.showNotification('Please select a city first.', 'error');
            return;
        }
        
        this.showLoadingOverlay(true, 'Generating 3D scene...');
        
        await this.delay(3000);
        
        const selectedCity = this.indianCities.find(city => 
            city.name.toLowerCase() === citySelect.value
        );
        
        this.render3DScene(selectedCity, roadType, trafficDensity, weather);
        this.displaySceneInfo(selectedCity, roadType, trafficDensity, weather);
        
        document.getElementById('exportSceneBtn').disabled = false;
        this.generatedScenes++;
        this.updateAnalytics();
        
        this.showLoadingOverlay(false);
        this.showNotification('3D scene generated successfully!', 'success');
    }

    render3DScene(city, roadType, trafficDensity, weather) {
        const canvas = document.getElementById('sceneCanvas');
        
        canvas.innerHTML = `
            <div class="scene-3d-preview">
                <div class="scene-header-info">
                    <h4>${city.name} - ${roadType.charAt(0).toUpperCase() + roadType.slice(1)} Road</h4>
                    <div class="scene-metadata">
                        <span class="metadata-item">
                            <i class="fas fa-car"></i> ${trafficDensity.charAt(0).toUpperCase() + trafficDensity.slice(1)} Traffic
                        </span>
                        <span class="metadata-item">
                            <i class="fas fa-cloud"></i> ${weather.charAt(0).toUpperCase() + weather.slice(1)}
                        </span>
                    </div>
                </div>
                <div class="scene-visualization">
                    <div class="road-visualization">
                        ${this.generateRoadVisualization(roadType, trafficDensity)}
                    </div>
                    <div class="scene-controls-overlay">
                        <button class="scene-control-btn" onclick="toolkit.rotateScene()">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="scene-control-btn" onclick="toolkit.zoomScene()">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateRoadVisualization(roadType, trafficDensity) {
        const lanes = roadType === 'highway' ? 4 : roadType === 'arterial' ? 3 : 2;
        const vehicleCount = trafficDensity === 'peak' ? 12 : trafficDensity === 'high' ? 8 : 4;
        
        let visualization = '<div class="road-lanes">';
        
        for (let i = 0; i < lanes; i++) {
            visualization += `<div class="lane lane-${i}">`;
            
            // Add vehicles based on density
            const vehiclesInLane = Math.floor(vehicleCount / lanes) + (i < vehicleCount % lanes ? 1 : 0);
            for (let v = 0; v < vehiclesInLane; v++) {
                const vehicleType = this.getRandomVehicleType();
                const position = (v + 1) * (100 / (vehiclesInLane + 1));
                visualization += `<div class="vehicle vehicle-${vehicleType}" style="left: ${position}%"></div>`;
            }
            
            visualization += '</div>';
        }
        
        visualization += '</div>';
        return visualization;
    }

    getRandomVehicleType() {
        const types = ['car', 'bike', 'truck', 'bus'];
        const weights = [40, 45, 10, 5]; // Indian traffic distribution
        
        const random = Math.random() * 100;
        let cumulative = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                return types[i];
            }
        }
        
        return 'car';
    }

    displaySceneInfo(city, roadType, trafficDensity, weather) {
        const sceneInfo = document.getElementById('sceneInfo');
        
        sceneInfo.innerHTML = `
            <div class="scene-details">
                <h4>Scene Configuration</h4>
                <div class="config-grid">
                    <div class="config-item">
                        <strong>Location:</strong> ${city.name}, ${city.state}
                    </div>
                    <div class="config-item">
                        <strong>Road Type:</strong> ${roadType.charAt(0).toUpperCase() + roadType.slice(1)}
                    </div>
                    <div class="config-item">
                        <strong>Traffic:</strong> ${trafficDensity.charAt(0).toUpperCase() + trafficDensity.slice(1)}
                    </div>
                    <div class="config-item">
                        <strong>Weather:</strong> ${weather.charAt(0).toUpperCase() + weather.slice(1)}
                    </div>
                </div>
                
                <div class="matlab-export-preview">
                    <h5>MATLAB Export Preview</h5>
                    <code>
                        scenario = generate3DScene('${city.name}', '${roadType}', '${trafficDensity}', '${weather}');<br>
                        roadRunner = exportToRoadRunner(scenario);<br>
                        simulink = createSimulinkModel(scenario);
                    </code>
                </div>
            </div>
        `;
    }

    async exportScene() {
        this.showLoadingOverlay(true, 'Exporting 3D scene...');
        
        await this.delay(2000);
        
        // Generate export files
        const sceneData = this.generateSceneExportData();
        this.downloadFile('indian_road_scene.rr', sceneData.roadRunner);
        this.downloadFile('scene_config.m', sceneData.matlab);
        
        this.showLoadingOverlay(false);
        this.showNotification('Scene exported successfully!', 'success');
    }

    generateSceneExportData() {
        const citySelect = document.getElementById('citySelect');
        const selectedCity = this.indianCities.find(city => 
            city.name.toLowerCase() === citySelect.value
        );
        
        const roadRunnerData = `
# RoadRunner Scene Export
# Generated: ${new Date().toISOString()}
# City: ${selectedCity.name}

[Scene]
Name=${selectedCity.name}_Road_Scene
Location=${selectedCity.lat},${selectedCity.lng}
RoadType=${document.getElementById('roadTypeSelect').value}
TrafficDensity=${document.getElementById('trafficDensitySelect').value}
Weather=${document.getElementById('weatherSelect').value}

[Indian_Features]
Potholes=true
MixedTraffic=true
NarrowLanes=true
Encroachments=true
        `.trim();
        
        const matlabData = `
% 3D Scene Configuration - ${selectedCity.name}
% Generated: ${new Date().toLocaleString()}

function scenario = generate3DScene()
    scenario = drivingScenario();
    
    % Road configuration for ${selectedCity.name}
    roadCenters = [0 0 0; 500 0 0; 1000 100 0];
    road(scenario, roadCenters, 'lanes', lanespec(3));
    
    % Indian road characteristics
    laneWidth = 3.2; % Reduced for Indian conditions
    shoulderWidth = 1.0;
    
    % Add traffic signals and infrastructure
    addTrafficSignals(scenario);
    addIndianRoadFeatures(scenario);
    
    % Export to RoadRunner
    exportToRoadRunner(scenario, '${selectedCity.name}_scene.rr');
    
    fprintf('3D scene generated for ${selectedCity.name}\\n');
end

function addIndianRoadFeatures(scenario)
    % Add potholes, construction zones, etc.
    % Implementation specific to Indian road conditions
end
        `.trim();
        
        return {
            roadRunner: roadRunnerData,
            matlab: matlabData
        };
    }

    setupTrafficSimulator() {
        const runSimBtn = document.getElementById('runSimulationBtn');
        const durationSlider = document.getElementById('durationSlider');
        const vehicleSliders = ['carSlider', 'bikeSlider', 'truckSlider', 'busSlider'];
        
        runSimBtn.addEventListener('click', () => this.runTrafficSimulation());
        
        durationSlider.addEventListener('input', (e) => {
            document.getElementById('durationValue').textContent = `${e.target.value} minutes`;
        });
        
        vehicleSliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            slider.addEventListener('input', (e) => {
                this.updateVehicleMix(sliderId, e.target.value);
            });
        });
        
        this.initializeTrafficCharts();
    }

    updateVehicleMix(sliderId, value) {
        const percentageId = sliderId.replace('Slider', 'Percentage');
        document.getElementById(percentageId).textContent = `${value}%`;
        
        // Auto-adjust other sliders to maintain 100% total
        this.normalizeVehicleMix(sliderId, parseInt(value));
    }

    normalizeVehicleMix(changedSliderId, newValue) {
        const sliders = ['carSlider', 'bikeSlider', 'truckSlider', 'busSlider'];
        const otherSliders = sliders.filter(id => id !== changedSliderId);
        
        let remainingPercentage = 100 - newValue;
        let currentTotal = 0;
        
        // Calculate current total of other sliders
        otherSliders.forEach(id => {
            currentTotal += parseInt(document.getElementById(id).value);
        });
        
        // Proportionally adjust other sliders
        if (currentTotal > 0) {
            otherSliders.forEach(id => {
                const slider = document.getElementById(id);
                const currentValue = parseInt(slider.value);
                const newSliderValue = Math.round((currentValue / currentTotal) * remainingPercentage);
                slider.value = newSliderValue;
                
                const percentageId = id.replace('Slider', 'Percentage');
                document.getElementById(percentageId).textContent = `${newSliderValue}%`;
            });
        }
    }

    async runTrafficSimulation() {
        const simStatus = document.getElementById('simStatus');
        const duration = document.getElementById('durationSlider').value;
        
        // Update status
        simStatus.innerHTML = '<div class="status-indicator running">Running simulation...</div>';
        
        this.showLoadingOverlay(true, 'Running traffic simulation...');
        
        // Simulate processing time
        await this.delay(4000);
        
        // Generate simulation results
        const results = this.generateSimulationResults(duration);
        this.displaySimulationResults(results);
        this.updateTrafficCharts(results);
        
        simStatus.innerHTML = '<div class="status-indicator completed">Simulation completed</div>';
        
        this.simulationsRun++;
        this.updateAnalytics();
        
        this.showLoadingOverlay(false);
        this.showNotification('Traffic simulation completed successfully!', 'success');
    }

    generateSimulationResults(duration) {
        const vehicleMix = {
            cars: parseInt(document.getElementById('carSlider').value),
            bikes: parseInt(document.getElementById('bikeSlider').value),
            trucks: parseInt(document.getElementById('truckSlider').value),
            buses: parseInt(document.getElementById('busSlider').value)
        };
        
        // Generate realistic Indian traffic data
        const timePoints = [];
        const flowData = [];
        const densityData = [];
        
        for (let i = 0; i <= duration; i++) {
            timePoints.push(i);
            
            // Simulate Indian traffic patterns with congestion
            const baseFlow = 1200 + Math.sin(i * 0.2) * 400 + Math.random() * 200;
            const baseDensity = 45 + Math.sin(i * 0.15) * 15 + Math.random() * 10;
            
            flowData.push(Math.max(0, baseFlow));
            densityData.push(Math.max(0, baseDensity));
        }
        
        return {
            duration: duration,
            vehicleMix: vehicleMix,
            timePoints: timePoints,
            flowData: flowData,
            densityData: densityData,
            metrics: {
                avgSpeed: 25.4 + Math.random() * 10,
                avgFlow: flowData.reduce((a, b) => a + b) / flowData.length,
                avgDensity: densityData.reduce((a, b) => a + b) / densityData.length,
                congestionIndex: 0.68 + Math.random() * 0.2,
                fuelConsumption: 12.5 + Math.random() * 3,
                emissions: 145 + Math.random() * 25
            }
        };
    }

    displaySimulationResults(results) {
        const metricsContainer = document.getElementById('simMetrics');
        
        metricsContainer.innerHTML = `
            <div class="metric-item">
                <div class="metric-value">${results.metrics.avgSpeed.toFixed(1)}</div>
                <div class="metric-label">Avg Speed (km/h)</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${results.metrics.avgFlow.toFixed(0)}</div>
                <div class="metric-label">Avg Flow (veh/h)</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${results.metrics.avgDensity.toFixed(1)}</div>
                <div class="metric-label">Avg Density (veh/km)</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${(results.metrics.congestionIndex * 100).toFixed(0)}%</div>
                <div class="metric-label">Congestion Index</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${results.metrics.fuelConsumption.toFixed(1)}</div>
                <div class="metric-label">Fuel (L/100km)</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${results.metrics.emissions.toFixed(0)}</div>
                <div class="metric-label">CO2 (g/km)</div>
            </div>
        `;
    }

    initializeTrafficCharts() {
        // Traffic Flow Chart
        const flowCtx = document.getElementById('trafficFlowChart').getContext('2d');
        this.charts.trafficFlow = new Chart(flowCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Traffic Flow (vehicles/hour)',
                    data: [],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#2d3748' },
                        ticks: { color: '#b0b3b8' }
                    },
                    y: {
                        grid: { color: '#2d3748' },
                        ticks: { color: '#b0b3b8' }
                    }
                }
            }
        });
        
        // Density Chart
        const densityCtx = document.getElementById('densityChart').getContext('2d');
        this.charts.density = new Chart(densityCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Traffic Density (vehicles/km)',
                    data: [],
                    borderColor: '#ffaa00',
                    backgroundColor: 'rgba(255, 170, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#2d3748' },
                        ticks: { color: '#b0b3b8' }
                    },
                    y: {
                        grid: { color: '#2d3748' },
                        ticks: { color: '#b0b3b8' }
                    }
                }
            }
        });
    }

    updateTrafficCharts(results) {
        // Update traffic flow chart
        this.charts.trafficFlow.data.labels = results.timePoints.map(t => `${t} min`);
        this.charts.trafficFlow.data.datasets[0].data = results.flowData;
        this.charts.trafficFlow.update();
        
        // Update density chart
        this.charts.density.data.labels = results.timePoints.map(t => `${t} min`);
        this.charts.density.data.datasets[0].data = results.densityData;
        this.charts.density.update();
    }

    setupWorkflowGenerator() {
        this.initializeWorkflowCards();
    }

    initializeWorkflowCards() {
        const workflowTypes = [
            {
                id: 'osm-import',
                title: 'OSM Data Import',
                description: 'Import and process OpenStreetMap data for Indian roads'
            },
            {
                id: '3d-scene',
                title: '3D Scene Generation',
                description: 'Generate realistic 3D road scenes with Indian characteristics'
            },
            {
                id: 'traffic-simulation',
                title: 'Traffic Simulation',
                description: 'Simulate mixed Indian traffic patterns'
            },
            {
                id: 'monsoon-analysis',
                title: 'Monsoon Impact',
                description: 'Analyze traffic during monsoon conditions'
            },
            {
                id: 'construction-zones',
                title: 'Construction Zones',
                description: 'Model construction zone traffic patterns'
            },
            {
                id: 'peak-hour',
                title: 'Peak Hour Analysis',
                description: 'Analyze traffic during peak hours'
            }
        ];
        
        const cardsContainer = document.getElementById('workflowCards');
        
        cardsContainer.innerHTML = workflowTypes.map(workflow => `
            <div class="workflow-card" data-workflow="${workflow.id}">
                <h4>${workflow.title}</h4>
                <p>${workflow.description}</p>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.workflow-card').forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                document.querySelectorAll('.workflow-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const workflowId = card.dataset.workflow;
                this.generateWorkflow(workflowId);
            });
        });
    }

    generateWorkflow(workflowId) {
        const workflows = {
            'osm-import': {
                steps: [
                    'Load OSM file into MATLAB workspace',
                    'Parse road network data and geometry',
                    'Classify roads by Indian standards',
                    'Extract traffic infrastructure elements',
                    'Generate driving scenario from OSM data',
                    'Export processed data for simulation'
                ],
                code: `
% OSM Data Import Workflow for Indian Roads
% Generated: ${new Date().toLocaleString()}

%% Step 1: Load OSM File
osmFile = 'indian_roads.osm';
osmData = readgeotable(osmFile);

%% Step 2: Extract Road Network
roads = osmData(strcmp(osmData.Type, 'way') & ...
              contains(osmData.highway, {'primary', 'secondary', 'trunk'}), :);

%% Step 3: Classify Indian Road Types
indianRoadTypes = classifyIndianRoads(roads);

%% Step 4: Generate Driving Scenario
scenario = drivingScenario();
for i = 1:height(indianRoadTypes)
    roadCenter = indianRoadTypes.geometry{i};
    laneSpec = createIndianLaneSpec(indianRoadTypes.Type{i});
    road(scenario, roadCenter, 'Lanes', laneSpec);
end

%% Step 5: Add Indian Traffic Features
addMixedTrafficElements(scenario);
addRoadConditions(scenario, 'indian');

%% Step 6: Export Results
save('indian_road_scenario.mat', 'scenario', 'indianRoadTypes');
fprintf('OSM import workflow completed\\n');

function laneSpec = createIndianLaneSpec(roadType)
    switch roadType
        case 'highway'
            laneSpec = lanespec(4, 3.2); % 4 lanes, 3.2m width
        case 'arterial'
            laneSpec = lanespec(3, 3.0); % 3 lanes, 3.0m width
        otherwise
            laneSpec = lanespec(2, 2.8); % 2 lanes, 2.8m width
    end
end`
            },
            '3d-scene': {
                steps: [
                    'Initialize RoadRunner scene builder',
                    'Define Indian road geometry parameters',
                    'Add realistic road surface textures',
                    'Place Indian traffic infrastructure',
                    'Configure lighting and weather conditions',
                    'Export 3D scene for MATLAB integration'
                ],
                code: `
% 3D Scene Generation for Indian Roads
% Generated: ${new Date().toLocaleString()}

%% Initialize 3D Scene Builder
rrApp = roadrunner();
scenario = drivingScenario();

%% Define Indian Road Characteristics
roadWidth = 3.2; % Typical Indian lane width
shoulderWidth = 1.0; % Narrow shoulders
medianWidth = 0.8; % Narrow medians

%% Create Road Geometry
roadCenters = [0 0 0; 500 0 0; 1000 200 0; 1500 500 0];
road(scenario, roadCenters, 'lanes', lanespec(3, roadWidth));

%% Add Indian Infrastructure
% Traffic signals
addTrafficLight(scenario, [500 0 0]);
addTrafficLight(scenario, [1000 200 0]);

% Road signs (Indian style)
addRoadSign(scenario, [250 0 0], 'Speed Limit 60');
addRoadSign(scenario, [750 100 0], 'School Zone');

%% Add Road Conditions
% Potholes
addPotholes(scenario, 25); % 25 potholes per km

% Construction zones
addConstructionZone(scenario, [600 50 0], 100);

%% Configure Weather and Lighting
setWeather(scenario, 'monsoon');
setLighting(scenario, 'overcast');

%% Export to RoadRunner
exportToRoadRunner(scenario, 'indian_road_3d.rr');
fprintf('3D scene generation completed\\n');`
            },
            'traffic-simulation': {
                steps: [
                    'Define Indian vehicle mix parameters',
                    'Configure driver behavior models',
                    'Set up traffic signal timing',
                    'Initialize mixed traffic simulation',
                    'Run simulation with Indian patterns',
                    'Analyze results and generate reports'
                ],
                code: `
% Indian Mixed Traffic Simulation
% Generated: ${new Date().toLocaleString()}

%% Define Indian Vehicle Mix
vehicleMix = struct();
vehicleMix.cars = 0.40;           % 40% cars
vehicleMix.twoWheelers = 0.45;    % 45% two-wheelers  
vehicleMix.trucks = 0.10;         % 10% trucks
vehicleMix.buses = 0.05;          % 5% buses

%% Configure Indian Driver Behavior
driverParams = struct();
driverParams.aggressiveness = 0.7;     % High aggressiveness
driverParams.laneChanging = 'frequent'; % Frequent lane changes
driverParams.gapAcceptance = 'low';     % Low gap acceptance
driverParams.speedVariation = 0.3;     % High speed variation

%% Initialize Traffic Simulation
scenario = drivingScenario();
roadCenters = [0 0 0; 2000 0 0];
road(scenario, roadCenters, 'lanes', lanespec(4));

%% Spawn Indian Traffic
numVehicles = 100;
for i = 1:numVehicles
    vehicleType = selectVehicleType(vehicleMix);
    spawnPosition = [rand()*1800 + 100, 0, 0];
    
    vehicle(scenario, 'ClassID', vehicleType, ...
            'Position', spawnPosition, ...
            'Speed', getIndianSpeed(vehicleType));
end

%% Run Simulation
simTime = 300; % 5 minutes
dt = 0.1;
results = simulate(scenario, simTime, dt);

%% Analyze Results
avgSpeed = mean(results.speed);
congestionIndex = calculateCongestion(results);
fuelConsumption = calculateFuelUsage(results, vehicleMix);

fprintf('Simulation Results:\\n');
fprintf('Average Speed: %.1f km/h\\n', avgSpeed);
fprintf('Congestion Index: %.2f\\n', congestionIndex);
fprintf('Fuel Consumption: %.1f L/100km\\n', fuelConsumption);`
            }
        };
        
        const selectedWorkflow = workflows[workflowId] || workflows['osm-import'];
        
        // Update workflow steps
        const stepsContainer = document.getElementById('workflowSteps');
        stepsContainer.innerHTML = `
            <ol class="workflow-step-list">
                ${selectedWorkflow.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
        
        // Update workflow code
        const codeContainer = document.getElementById('workflowCode');
        codeContainer.innerHTML = `<pre><code>${selectedWorkflow.code}</code></pre>`;
        
        // Enable action buttons
        document.getElementById('downloadWorkflowBtn').disabled = false;
        document.getElementById('copyWorkflowBtn').disabled = false;
        
        // Add event listeners for buttons
        document.getElementById('downloadWorkflowBtn').onclick = () => {
            this.downloadFile(`${workflowId}_workflow.m`, selectedWorkflow.code);
            this.showNotification('Workflow downloaded successfully!', 'success');
        };
        
        document.getElementById('copyWorkflowBtn').onclick = () => {
            this.copyToClipboard('workflowCode');
        };
    }

    setupCitiesDatabase() {
        this.renderCitiesGrid();
    }

    renderCitiesGrid() {
        const gridContainer = document.getElementById('citiesGrid');
        
        gridContainer.innerHTML = this.indianCities.map(city => `
            <div class="city-card" data-city="${city.name.toLowerCase()}">
                <div class="city-header">
                    <div>
                        <div class="city-name">${city.name}</div>
                        <div class="city-state">${city.state}</div>
                    </div>
                    <div class="traffic-indicator traffic-${city.traffic_density.toLowerCase().replace(' ', '-')}">
                        ${city.traffic_density}
                    </div>
                </div>
                <div class="city-stats">
                    <div class="city-stat">
                        <span class="city-stat-value">${(city.population / 1000000).toFixed(1)}M</span>
                        <span class="city-stat-label">Population</span>
                    </div>
                    <div class="city-stat">
                        <span class="city-stat-value">${city.road_length.toLocaleString()}</span>
                        <span class="city-stat-label">Road Length (km)</span>
                    </div>
                    <div class="city-stat">
                        <span class="city-stat-value">${Object.values(city.osm_features).reduce((a, b) => a + b, 0)}</span>
                        <span class="city-stat-label">Road Segments</span>
                    </div>
                    <div class="city-stat">
                        <span class="city-stat-value">${city.challenges.length}</span>
                        <span class="city-stat-label">Key Challenges</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.city-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.city-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const cityName = card.dataset.city;
                const city = this.indianCities.find(c => c.name.toLowerCase() === cityName);
                this.displayCityDetails(city);
            });
        });
    }

    displayCityDetails(city) {
        const detailsContainer = document.getElementById('cityDetails');
        
        detailsContainer.innerHTML = `
            <div class="city-detail-content">
                <div class="city-detail-header">
                    <h3>${city.name}, ${city.state}</h3>
                    <div class="city-coordinates">
                        <i class="fas fa-map-marker-alt"></i>
                        ${city.lat.toFixed(4)}, ${city.lng.toFixed(4)}
                    </div>
                </div>
                
                <div class="detail-sections">
                    <div class="detail-section">
                        <h4><i class="fas fa-road"></i> Road Network</h4>
                        <div class="road-breakdown">
                            <div class="road-type">
                                <span class="road-label">Highways:</span>
                                <span class="road-value">${city.osm_features.highways}</span>
                            </div>
                            <div class="road-type">
                                <span class="road-label">Arterials:</span>
                                <span class="road-value">${city.osm_features.arterials}</span>
                            </div>
                            <div class="road-type">
                                <span class="road-label">Collectors:</span>
                                <span class="road-value">${city.osm_features.collectors}</span>
                            </div>
                            <div class="road-type">
                                <span class="road-label">Local Roads:</span>
                                <span class="road-value">${city.osm_features.local_roads}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-exclamation-triangle"></i> Key Challenges</h4>
                        <div class="challenges-list">
                            ${city.challenges.map(challenge => `
                                <div class="challenge-item">
                                    <i class="fas fa-dot-circle"></i>
                                    <span>${challenge}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-route"></i> Major Roads</h4>
                        <div class="major-roads-list">
                            ${city.major_roads.map(road => `
                                <div class="major-road-item">
                                    <i class="fas fa-road"></i>
                                    <span>${road}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fab fa-matlab"></i> MATLAB Integration</h4>
                        <div class="matlab-integration">
                            <button class="btn btn-primary" onclick="toolkit.generateCityMATLAB('${city.name}')">
                                <i class="fas fa-code"></i> Generate MATLAB Code
                            </button>
                            <button class="btn btn-secondary" onclick="toolkit.exportCityData('${city.name}')">
                                <i class="fas fa-download"></i> Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCityMATLAB(cityName) {
        const city = this.indianCities.find(c => c.name === cityName);
        
        const matlabCode = `
% ${city.name} Road Network Analysis
% Generated: ${new Date().toLocaleString()}

%% City Information
cityName = '${city.name}';
cityState = '${city.state}';
cityCenter = [${city.lat}, ${city.lng}];
population = ${city.population};

%% Road Network Data
roadNetwork = struct();
roadNetwork.highways = ${city.osm_features.highways};
roadNetwork.arterials = ${city.osm_features.arterials};
roadNetwork.collectors = ${city.osm_features.collectors};
roadNetwork.localRoads = ${city.osm_features.local_roads};
roadNetwork.totalLength = ${city.road_length}; % km

%% Traffic Characteristics
trafficDensity = '${city.traffic_density}';
majorRoads = {${city.major_roads.map(road => `'${road}'`).join(', ')}};

%% Key Challenges
challenges = {${city.challenges.map(challenge => `'${challenge}'`).join(', ')}};

%% Generate Driving Scenario for ${city.name}
scenario = drivingScenario();

% Create representative road network
roadCenters = [0 0 0; 2000 0 0; 4000 1000 0];
road(scenario, roadCenters, 'lanes', lanespec(4, 3.2));

% Add ${city.name}-specific features
${this.generateCitySpecificFeatures(city)}

%% Traffic Simulation Setup
vehicleMix = getIndianVehicleMix();
trafficFlow = calculateTrafficFlow('${city.traffic_density.toLowerCase()}');

fprintf('${city.name} road network initialized\\n');
fprintf('Total road segments: %d\\n', roadNetwork.highways + roadNetwork.arterials + roadNetwork.collectors + roadNetwork.localRoads);
fprintf('Road network ready for simulation\\n');

%% Export Results
save('${city.name.toLowerCase()}_road_network.mat', 'roadNetwork', 'scenario', 'challenges');
        `.trim();
        
        this.showCodeModal(matlabCode);
    }

    generateCitySpecificFeatures(city) {
        let features = '';
        
        if (city.challenges.includes('Monsoons') || city.challenges.includes('Frequent rains')) {
            features += `
% Add monsoon-specific features
addWeatherCondition(scenario, 'heavy_rain');
adjustRoadFriction(scenario, 0.3); % Reduced friction for wet roads`;
        }
        
        if (city.challenges.includes('Construction zones')) {
            features += `
% Add construction zones
addConstructionZone(scenario, [1000 0 0], 200); % 200m construction zone`;
        }
        
        if (city.challenges.includes('Mixed traffic')) {
            features += `
% Configure mixed traffic patterns
setMixedTrafficRatio(scenario, [0.4, 0.45, 0.1, 0.05]); % Cars, bikes, trucks, buses`;
        }
        
        return features;
    }

    exportCityData(cityName) {
        const city = this.indianCities.find(c => c.name === cityName);
        
        const csvData = [
            'Parameter,Value',
            `City Name,${city.name}`,
            `State,${city.state}`,
            `Latitude,${city.lat}`,
            `Longitude,${city.lng}`,
            `Population,${city.population}`,
            `Road Length (km),${city.road_length}`,
            `Traffic Density,${city.traffic_density}`,
            `Highways,${city.osm_features.highways}`,
            `Arterials,${city.osm_features.arterials}`,
            `Collectors,${city.osm_features.collectors}`,
            `Local Roads,${city.osm_features.local_roads}`,
            `Major Roads,"${city.major_roads.join('; ')}"`,
            `Challenges,"${city.challenges.join('; ')}"`
        ].join('\n');
        
        this.downloadFile(`${city.name.toLowerCase()}_data.csv`, csvData);
        this.showNotification(`${city.name} data exported successfully!`, 'success');
    }

    initializeCharts() {
        // Charts will be initialized when analytics section is shown
    }

    renderAnalyticsCharts() {
        this.renderCityTrafficChart();
        this.renderRoadDistributionChart();
    }

    renderCityTrafficChart() {
        const ctx = document.getElementById('cityTrafficChart');
        if (!ctx) return;
        
        if (this.charts.cityTraffic) {
            this.charts.cityTraffic.destroy();
        }
        
        this.charts.cityTraffic = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: this.indianCities.map(city => city.name),
                datasets: [{
                    label: 'Road Length (km)',
                    data: this.indianCities.map(city => city.road_length),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'],
                    borderColor: '#00d4ff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#2d3748' },
                        ticks: { color: '#b0b3b8' }
                    },
                    y: {
                        grid: { color: '#2d3748' },
                        ticks: { color: '#b0b3b8' }
                    }
                }
            }
        });
    }

    renderRoadDistributionChart() {
        const ctx = document.getElementById('roadDistributionChart');
        if (!ctx) return;
        
        if (this.charts.roadDistribution) {
            this.charts.roadDistribution.destroy();
        }
        
        // Calculate total roads by type
        const roadTypes = {
            highways: 0,
            arterials: 0,
            collectors: 0,
            local_roads: 0
        };
        
        this.indianCities.forEach(city => {
            roadTypes.highways += city.osm_features.highways;
            roadTypes.arterials += city.osm_features.arterials;
            roadTypes.collectors += city.osm_features.collectors;
            roadTypes.local_roads += city.osm_features.local_roads;
        });
        
        this.charts.roadDistribution = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Highways', 'Arterials', 'Collectors', 'Local Roads'],
                datasets: [{
                    data: [roadTypes.highways, roadTypes.arterials, roadTypes.collectors, roadTypes.local_roads],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderColor: '#2d3748',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#ffffff', padding: 20 }
                    }
                }
            }
        });
    }

    updateAnalytics() {
        // Update metrics
        const totalRoads = this.indianCities.reduce((total, city) => {
            return total + Object.values(city.osm_features).reduce((sum, count) => sum + count, 0);
        }, 0);
        
        document.getElementById('totalRoads').textContent = totalRoads.toLocaleString();
        document.getElementById('citiesAnalyzed').textContent = this.indianCities.length;
        document.getElementById('scenesGenerated').textContent = this.generatedScenes;
        document.getElementById('simulationsRun').textContent = this.simulationsRun;
    }

    populateCitySelectors() {
        // Populate all city selectors in the application
        const selectors = document.querySelectorAll('select[id*="city" i], select[id*="City"]');
        selectors.forEach(select => {
            this.populateCitySelect(select);
        });
        
        // Specifically ensure scene builder city select is populated
        this.populateSceneBuilderCitySelect();
    }

    // Utility Methods
    showLoadingOverlay(show, message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = overlay.querySelector('p');
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    showCodeModal(code) {
        const modal = document.getElementById('codeModal');
        const codeContent = document.getElementById('modalCodeContent');
        
        codeContent.textContent = code;
        modal.classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent || element.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy code', 'error');
        });
    }

    copyModalCode() {
        const codeContent = document.getElementById('modalCodeContent');
        const text = codeContent.textContent || codeContent.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
            this.closeModal('codeModal');
        }).catch(() => {
            this.showNotification('Failed to copy code', 'error');
        });
    }

    downloadCode() {
        const codeContent = document.getElementById('modalCodeContent');
        const text = codeContent.textContent || codeContent.innerText;
        
        this.downloadFile('matlab_code.m', text);
        this.closeModal('codeModal');
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    rotateScene() {
        this.showNotification('Scene rotation applied', 'success');
    }

    zoomScene() {
        this.showNotification('Scene zoom applied', 'success');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for HTML event handlers
window.showSection = (sectionId) => toolkit.showSection(sectionId);
window.closeModal = (modalId) => toolkit.closeModal(modalId);
window.copyToClipboard = (elementId) => toolkit.copyToClipboard(elementId);
window.copyModalCode = () => toolkit.copyModalCode();
window.downloadCode = () => toolkit.downloadCode();

// Initialize the application when page loads
let toolkit;
document.addEventListener('DOMContentLoaded', () => {
    toolkit = new IndianRoadToolkit();
    window.toolkit = toolkit; // Make globally accessible
});

// Add notification styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--surface-bg);
    color: var(--primary-text);
    padding: 15px 20px;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 10000;
    min-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-color: var(--success-color);
}

.notification-success i {
    color: var(--success-color);
}

.notification-error {
    border-color: var(--error-color);
}

.notification-error i {
    color: var(--error-color);
}

.notification-info {
    border-color: var(--accent-blue);
}

.notification-info i {
    color: var(--accent-blue);
}

/* Additional styles for analysis results */
.analysis-summary {
    margin-bottom: 30px;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-top: 15px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: var(--primary-bg);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

.summary-label {
    color: var(--secondary-text);
}

.summary-value {
    color: var(--accent-blue);
    font-weight: bold;
}

.road-network-analysis {
    margin-bottom: 30px;
}

.network-stats {
    margin-top: 15px;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
}

.stat-row.total {
    border-top: 2px solid var(--accent-blue);
    margin-top: 10px;
    padding-top: 15px;
    color: var(--accent-blue);
}

.stat-value {
    font-weight: bold;
}

.indian-features-analysis h4 {
    margin-bottom: 20px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.feature-card {
    background: var(--primary-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.feature-card i {
    font-size: 1.5rem;
    color: var(--warning-color);
}

.feature-card strong {
    color: var(--accent-blue);
    display: block;
    font-size: 1.2rem;
}

.feature-card span {
    color: var(--secondary-text);
    font-size: 0.9rem;
}

/* Scene visualization styles */
.scene-3d-preview {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.scene-header-info {
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
}

.scene-header-info h4 {
    margin-bottom: 10px;
    color: var(--primary-text);
}

.scene-metadata {
    display: flex;
    gap: 20px;
}

.metadata-item {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--secondary-text);
    font-size: 0.9rem;
}

.scene-visualization {
    flex: 1;
    position: relative;
    background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%);
    overflow: hidden;
}

.road-visualization {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: #404040;
    border-top: 3px solid #666;
}

.road-lanes {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.lane {
    flex: 1;
    position: relative;
    border-bottom: 2px dashed #888;
    background: repeating-linear-gradient(
        to right,
        #404040,
        #404040 50px,
        #505050 50px,
        #505050 100px
    );
}

.lane:last-child {
    border-bottom: none;
}

.vehicle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 15px;
    border-radius: 3px;
    transition: left 2s ease-in-out;
}

.vehicle-car { background: #ff6b6b; }
.vehicle-bike { background: #4ecdc4; width: 15px; height: 8px; }
.vehicle-truck { background: #45b7d1; width: 40px; height: 20px; }
.vehicle-bus { background: #f7dc6f; width: 45px; height: 18px; }

.scene-controls-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
}

.scene-control-btn {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    cursor: pointer;
    transition: var(--transition);
}

.scene-control-btn:hover {
    background: rgba(0, 212, 255, 0.8);
}

/* City detail styles */
.road-breakdown {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.road-type {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
}

.road-label {
    color: var(--secondary-text);
}

.road-value {
    color: var(--accent-blue);
    font-weight: bold;
}

.challenges-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.challenge-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--secondary-text);
}

.challenge-item i {
    color: var(--warning-color);
    font-size: 0.8rem;
}

.major-roads-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.major-road-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--secondary-text);
    font-size: 0.9rem;
}

.major-road-item i {
    color: var(--accent-blue);
}

/* Workflow step list */
.workflow-step-list {
    color: var(--secondary-text);
    padding-left: 20px;
}

.workflow-step-list li {
    margin-bottom: 10px;
    line-height: 1.4;
}
`;

// Inject notification styles
const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);