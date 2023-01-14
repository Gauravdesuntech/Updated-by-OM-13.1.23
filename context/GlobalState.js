import React from "react";
import AppContext from "./AppContext";
// import { readCustomerData } from "../utils/Util";

export default class GlobalState extends React.Component {
  constructor(props) {
    super(props);

    this.setUserData = (data) => this.setState({ userDetails: data });

    this.unsetUserData = () => this.setState({ userDetails: null });

    this.setFilterDetails = (data) => this.setState({ filterDetails: data });

    this.unsetFilterDetails = () => this.setState({ filterDetails: null });

    this.setGroups = (data) => this.setState({ groups: data });

    this.setLocations = (data) => this.setState({ locations: data });

    this.setSections = (data) => this.setState({ sections: data });

    this.setCategories = (data) => this.setState({ categories: data });

    this.setSubCategories = (data) => this.setState({ subCategories: data });

    this.setSpecies = (data) => this.setState({ species: data });

    this.setSubSpecies = (data) => this.setState({ subSpecies: data });

    this.setAnimals = (data) => this.setState({ animals: data });

    this.setAnimalID = (id) => this.setState({ selectedAnimalID: id });

    this.setAnimalVaccines = (data) => this.setState({ animalVaccines: data });

    this.setAnimalVaccinationDetails = (data) =>
      this.setState({ animalVaccinationDetails: data });

    this.setAnimalDiagnosis = (data) =>
      this.setState({ animalDiagnosis: data });

    this.setAnimalEnclosures = (data) =>
      this.setState({ animalEnclosures: data });

    this.setAnimalIncidents = (data) =>
      this.setState({ animalIncidents: data });

    this.setAnimalMeasurements = (data) =>
      this.setState({ animalMeasurements: data });

    this.setAnimalFeedingAssignments = (data) =>
      this.setState({ animalFeedingAssignments: data });

    this.setAnimalFeedingsData = (data) =>
      this.setState({ animalFeedings: data });

    this.setLocale = (data) => this.setState({ locale: data });

    this.state = {
      // userDetails: {
      // 	cid: "1",
      // 	name: null,
      // },
      userDetails: props.userDetails,
      groups: [],
      locations: [],
      sections: [],
      categories: [],
      subCategories: [],
      species: [],
      subSpecies: [],
      animals: [],
      selectedAnimalID: undefined,
      animalVaccines: [],
      animalVaccinationDetails: [],
      animalDiagnosis: [],
      animalEnclosures: [],
      animalIncidents: [],
      animalMeasurements: [],
      animalFeedingAssignments: [],
      animalFeedings: [],
      locale: "en",
      setUserData: this.setUserData,
      unsetUserData: this.unsetUserData,
      setFilterDetails: this.setFilterDetails,
      unsetFilterDetails: this.unsetFilterDetails,
      setGroups: this.setGroups,
      setLocations: this.setLocations,
      setSections: this.setSections,
      setCategories: this.setCategories,
      setSubCategories: this.setSubCategories,
      setSpecies: this.setSpecies,
      setSubSpecies: this.setSubSpecies,
      setAnimals: this.setAnimals,
      setAnimalID: this.setAnimalID,
      setAnimalVaccines: this.setAnimalVaccines,
      setAnimalVaccinationDetails: this.setAnimalVaccinationDetails,
      setAnimalDiagnosis: this.setAnimalDiagnosis,
      setAnimalEnclosures: this.setAnimalEnclosures,
      setAnimalIncidents: this.setAnimalIncidents,
      setAnimalMeasurements: this.setAnimalMeasurements,
      setAnimalFeedingAssignments: this.setAnimalFeedingAssignments,
      setAnimalFeedingsData: this.setAnimalFeedingsData,
      setLocale: this.setLocale,
    };
  }

  render = () => (
    <AppContext.Provider value={this.state}>
      {this.props.children}
    </AppContext.Provider>
  );
}
