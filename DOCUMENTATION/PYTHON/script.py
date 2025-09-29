import json
import pandas as pd
import numpy as np

# Create comprehensive Indian road network data for major cities
indian_cities_data = {
    "cities": [
        {
            "name": "Hyderabad",
            "state": "Telangana",
            "lat": 17.3850,
            "lng": 78.4867,
            "population": 10000000,
            "road_length": 12500,  # km
            "traffic_density": "High",
            "major_roads": ["PVNR Expressway", "ORR", "Nehru Outer Ring Road", "Cyberabad Road"],
            "challenges": ["Rapid IT expansion", "Mixed traffic", "Frequent rains", "Construction zones"],
            "osm_features": {
                "highways": 450,
                "arterials": 120,
                "collectors": 850,
                "local_roads": 5200
            }
        },
        {
            "name": "Mumbai",
            "state": "Maharashtra", 
            "lat": 19.0760,
            "lng": 72.8777,
            "population": 20400000,
            "road_length": 18000,
            "traffic_density": "Very High",
            "major_roads": ["Eastern Express Highway", "Western Express Highway", "SCLR", "JVLR"],
            "challenges": ["Island geography", "Monsoons", "Slums", "Bridge bottlenecks"],
            "osm_features": {
                "highways": 12,
                "arterials": 45,
                "collectors": 180,
                "local_roads": 2800
            }
        },
        {
            "name": "Delhi",
            "state": "Delhi",
            "lat": 28.7041,
            "lng": 77.1025, 
            "population": 32900000,
            "road_length": 32000,
            "traffic_density": "Very High",
            "major_roads": ["Ring Road", "Outer Ring Road", "DND Flyway", "Noida Expressway"],
            "challenges": ["Air pollution", "Mixed vehicle types", "Extreme weather", "Encroachments"],
            "osm_features": {
                "highways": 28,
                "arterials": 85,
                "collectors": 420,
                "local_roads": 8200
            }
        },
        {
            "name": "Chennai",
            "state": "Tamil Nadu",
            "lat": 13.0827,
            "lng": 80.2707,
            "population": 11700000,
            "road_length": 9800,
            "traffic_density": "High", 
            "major_roads": ["GST Road", "ECR", "OMR", "Mount Road"],
            "challenges": ["Coastal flooding", "Two-wheeler dominance", "IT corridor traffic", "Heat waves"],
            "osm_features": {
                "highways": 18,
                "arterials": 42,
                "collectors": 230,
                "local_roads": 3100
            }
        },
        {
            "name": "Bangalore",
            "state": "Karnataka",
            "lat": 12.9716,
            "lng": 77.5946,
            "population": 13200000,
            "road_length": 14500,
            "traffic_density": "Very High",
            "major_roads": ["ORR", "Hosur Road", "Bannerghatta Road", "Electronic City"],
            "challenges": ["Tech hub traffic", "Lakes/terrain", "Metro construction", "Narrow roads"],
            "osm_features": {
                "highways": 22,
                "arterials": 65,
                "collectors": 340,
                "local_roads": 4800
            }
        },
        {
            "name": "Kolkata",
            "state": "West Bengal",
            "lat": 22.5726,
            "lng": 88.3639,
            "population": 14700000,
            "road_length": 8200,
            "traffic_density": "High",
            "major_roads": ["AJC Bose Road", "EM Bypass", "VIP Road", "Jessore Road"],
            "challenges": ["River crossings", "Old infrastructure", "Monsoons", "Hand-pulled rickshaws"],
            "osm_features": {
                "highways": 8,
                "arterials": 25,
                "collectors": 120,
                "local_roads": 2200
            }
        }
    ]
}

# Create traffic patterns data
traffic_patterns = {
    "peak_hours": {
        "morning": "8:00-10:00",
        "evening": "17:30-20:00"
    },
    "vehicle_composition": {
        "cars": 25,
        "two_wheelers": 45,
        "buses": 8,
        "trucks": 12,
        "auto_rickshaws": 10
    },
    "road_conditions": {
        "good": 35,
        "average": 45,
        "poor": 20
    }
}

# Create MATLAB integration workflows
matlab_workflows = {
    "scenario_generation": {
        "steps": [
            "Import OSM data using readgeotable",
            "Extract road properties with roadprops",
            "Create driving scenario with drivingScenario",
            "Add road network with roadNetwork function",
            "Generate traffic patterns",
            "Export to RoadRunner Scene Builder"
        ],
        "functions": [
            "roadNetwork", "drivingScenario", "roadprops", 
            "latlon2local", "vehicle", "smoothTrajectory"
        ]
    },
    "simulation_tools": {
        "perception": ["visionDetectionGenerator", "radarDetectionGenerator"],
        "planning": ["pathPlannerRRT", "trajectoryOptimalFrenet"],
        "control": ["lateralControllerStanley", "longitudinalControllerPID"],
        "visualization": ["chasePlot", "birdsEyePlot"]
    }
}

# Save all data to JSON files
with open("indian_cities_road_data.json", "w") as f:
    json.dump(indian_cities_data, f, indent=2)

with open("traffic_patterns.json", "w") as f:
    json.dump(traffic_patterns, f, indent=2)
    
with open("matlab_workflows.json", "w") as f:
    json.dump(matlab_workflows, f, indent=2)

print("Created comprehensive Indian road network dataset")
print(f"Total cities: {len(indian_cities_data['cities'])}")
print(f"Total road length: {sum([city['road_length'] for city in indian_cities_data['cities']])} km")