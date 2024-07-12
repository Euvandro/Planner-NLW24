import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { TripDetails, tripServer } from "@/server/trip-server";
import { Loading } from "@/components/loading";
import { Input } from "@/components/input";
import { CalendarRange, Info, MapPin, Settings2, Calendar as IconCalendar, User, Mail } from "lucide-react-native";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import { Button } from "@/components/button";
import { TripActivitiesView } from "./activities";
import { TripDetailsView } from "./details";
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";
import { DateData } from "react-native-calendars";
import { DatesSelected, calendarUtils } from "@/utils/calendarUtils";

export type TripData = TripDetails & { when: string }

enum MODAL {
    NONE = 0,
    UPDATE_TRIP = 1,
    CALENDAR = 2,
}

export default function Trip() {

    const tripId = useLocalSearchParams<{ id: string }>().id;

    const [isLoadingTrip, setIsLoadingTrip] = useState(true);
    const [isUpdatingTrip, setIsUpdatingTrip] = useState(false);
    const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false);

    const [destination, setDestination] = useState("");
    const [tripDatails, setTripDetails] = useState({} as TripData);
    const [option, setOption] = useState<"activity" | "details">("activity");

    const [showModal, setShowModal] = useState(MODAL.NONE);



    const [selectedDates, setSelectedDates] = useState({} as DatesSelected);

    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    useEffect(() => {
        getTripDetails();
    }, [])



    async function getTripDetails() {
        try {
            setIsLoadingTrip(true);
            if (!tripId) {
                return router.back();
            }

            const trip = await tripServer.getById(tripId);

            const maxLenghtDestination = 14;
            const destination = trip.destination.length > maxLenghtDestination ? trip.destination.slice(0, maxLenghtDestination) + "..." : trip.destination;

            const starts_at = dayjs(trip.starts_at).format("DD");
            const ends_at = dayjs(trip.ends_at).format("DD");
            const month = dayjs(trip.ends_at).format("MMM");

            setDestination(trip.destination);

            setTripDetails({ ...trip, when: `${destination} de ${starts_at} à ${ends_at} de ${month}.` })


        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingTrip(false);
        }
    }

    function handleSelectDate(selectedDay: DateData) {
        const dates = calendarUtils.orderStartsAtAndEndsAt({ startsAt: selectedDates.startsAt, endsAt: selectedDates.endsAt, selectedDay })
        setSelectedDates(dates);
    }

    async function handleUpdateTrip() {
        try {
            if (!tripId) return;

            if (!destination || !selectedDates.startsAt || !selectedDates.endsAt) {
                return Alert.alert("Atualizar viagem", "Lembre-se de, além de preencher o destino, selecionar as datas de inicio e fim.")
            }

            setIsUpdatingTrip(true);

            await tripServer.update({
                id: tripId,
                destination,
                starts_at: dayjs(selectedDates.startsAt.dateString).toString(),
                ends_at: dayjs(selectedDates.endsAt.dateString).toString(),
            })

            Alert.alert("Atualizar viagem", "Viagem atualizada com sucesso!", [{
                text: "Ok!", onPress: () => {
                    setShowModal(MODAL.NONE);
                    getTripDetails();
                }
            }])
        } catch (error) {
            console.log(error);
        } finally {
            setIsUpdatingTrip(false);
        }
    }

    async function handleConfirmAttendance(){
        try {
            


        } catch (error) {
            console.log(error);
            
        }finally{
            setIsConfirmingAttendance(false);
        }
    }

    if (isLoadingTrip) return <Loading />


    return (

        <View className="flex-1 px-5 pt-16">

            <Input variant="tertiary">
                <MapPin color={colors.zinc[400]} size={20} />
                <Input.Field value={tripDatails.when} readOnly />

                <TouchableOpacity activeOpacity={0.7} onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
                    <View className="w-9 h-9 bg-zinc-800 items-center justify-center rounded">
                        <Settings2 color={colors.zinc[400]} size={20} />
                    </View>
                </TouchableOpacity>

            </Input>

            {option === "activity" ? (<TripActivitiesView tripDetails={tripDatails} />) : (<TripDetailsView tripId={tripDatails.id} />)}


            <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">

                <View className="w-full flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2">

                    <Button
                        flex
                        className="flex-1"
                        onPress={() => setOption("activity")}
                        variant={option === "activity" ? "primary" : "secondary"}
                    >
                        <CalendarRange color={option === "activity" ? colors.lime[950] : colors.zinc[200]} size={20} />
                        <Button.Title>Atividades</Button.Title>
                    </Button>


                    <Button
                        flex
                        className="flex-1"
                        onPress={() => setOption("details")}
                        variant={option === "details" ? "primary" : "secondary"}
                    >
                        <Info color={option === "details" ? colors.lime[950] : colors.zinc[200]} size={20} />
                        <Button.Title>Detalhes</Button.Title>
                    </Button>

                </View>

            </View>

            <Modal title="Atualizar viagem" subtitle="Somente quem criou a viagem pode editar." visible={showModal === MODAL.UPDATE_TRIP} onClose={() => setShowModal(MODAL.NONE)}>
                <View className="gap-2 my-4">
                    <Input variant="secondary">
                        <MapPin color={colors.zinc[400]} size={20} />
                        <Input.Field onChangeText={setDestination} value={destination} placeholder="Para onde?" />
                    </Input>

                    <Input variant="secondary">
                        <IconCalendar color={colors.zinc[400]} size={20} />
                        <Input.Field value={selectedDates.formatDatesInText} placeholder="Quando?" onPressIn={() => setShowModal(MODAL.CALENDAR)} onFocus={() => Keyboard.dismiss()} />
                    </Input>

                    <Button onPress={handleUpdateTrip} isLoading={isUpdatingTrip}>
                        <Button.Title>Atualizar</Button.Title>
                    </Button>

                </View>
            </Modal>

            <Modal title='Selecionar datas' subtitle='Selecione a data de ida e volta da viagem' visible={showModal === MODAL.CALENDAR} onClose={() => setShowModal(MODAL.NONE)}>
                <View className='gap-4 mt-4'>
                    <Calendar onDayPress={handleSelectDate} markedDates={selectedDates.dates} minDate={dayjs().toISOString()} />

                    <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>

            <Modal title="Confirmar presença" visible>
                <View className="gap-4 mt-4">
                    <Text className="text-zinc-400 font-regular leading-6 my-2">
                        Você foi convidado(a) para participar de uma viagem para 
                        <Text className="font-semibold text-zinc-100">{ " " }{tripDatails.destination}{ " " }</Text>
                        nas datas de
                        <Text className="font-semibold text-zinc-100">{ " " }{dayjs(tripDatails.starts_at).date()} a{ " " } {dayjs(tripDatails.ends_at).date()} de{" "}{dayjs(tripDatails.ends_at).format("MMMM")}. {"\n\n"}</Text>
                        Para confirmar sua presença na viagem preencha os campos abaixo.
                    </Text>

                    <Input variant="secondary">
                        <User color={colors.zinc[400]} size={20}/>
                        <Input.Field placeholder="Seu nome completo"/>
                    </Input>

                    <Input variant="secondary">
                        <Mail color={colors.zinc[400]} size={20}/>
                        <Input.Field placeholder="E-mail de confirmação"/>
                    </Input>

                    <Button flex className="flex-1" isLoading={isConfirmingAttendance}>
                        <Button.Title>Confirmar minha presença</Button.Title>
                    </Button>
                </View>
            </Modal>

        </View>

    )
}