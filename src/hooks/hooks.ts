import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/types";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();