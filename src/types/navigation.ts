import { Tour, Stop, Profile } from '../services/db';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ProfileStackParamList = {
  ProfileView: undefined;
  ProfileEdit: { profile: Profile };
};

export type ToursStackParamList = {
  ToursList: undefined;
  TourForm: { tour?: Tour, isUpdate: boolean } | undefined;
  StopsList: { tourId: string };
  StopForm: { tourId: string; stop?: Stop, isUpdate: boolean };
};

export type BottomTabsParamList = {
  Home: undefined;
  Profile: undefined;
  Tours: undefined;
  ChatBot: undefined;
};