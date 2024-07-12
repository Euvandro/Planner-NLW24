import { useEffect, useState } from "react";

import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { colors } from "@/styles/colors";
import { Plus } from "lucide-react-native";
import { Alert, Text, View, FlatList } from "react-native";
import { Input } from "@/components/input";
import { validateInput } from "@/utils/validateInput";
import { linksServer } from "@/server/links-server";
import { TripLinkProps, TripLink } from "@/components/tripLink";
import { participantsServer } from "@/server/participants-server";
import { Participant, ParticipantProps } from "@/components/participant";




export function TripDetailsView({ tripId }: { tripId: string }) {

    const [showModal, setShowModal] = useState(false)

    const [linkName, setLinkName] = useState("");
    const [linkURL, setLinkURL] = useState("");

    const [links, setLinks] = useState<TripLinkProps[]>([]);
    const [participants, setParticipants] = useState<ParticipantProps[]>([])

    const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false);


    useEffect(() => {
        getTripLinks();
        getTripParticipants();
    }, [])

    function resetNewLinkFields() {
        setLinkName("");
        setLinkURL("");
        setShowModal(false);
    }

    async function handleCreateLinkTrip() {

        try {

            if (!linkName.trim()) {
                return Alert.alert("Link", "Informe o titulo do link.");
            }
            if (!validateInput.url(linkURL.trim())) {
                return Alert.alert("Link", "Link inválido.")
            }



            setIsCreatingLinkTrip(true);

            await linksServer.create({ tripId, title: linkName, url: linkURL });

            Alert.alert("Link", "Link criado com sucesso.")
            resetNewLinkFields();
            await getTripLinks();

        } catch (error) {
            console.log(error)
        } finally {
            setIsCreatingLinkTrip(false);
        }

    }


    async function getTripLinks() {
        try {
            const links = await linksServer.getLinksByTripId(tripId);

            setLinks(links);

        } catch (error) {
            console.log(error);
        }
    }

    async function getTripParticipants() {
        try {
            const participants = await participantsServer.getByTripId(tripId);

            setParticipants(participants);

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <View className="flex-1 mt-10">
            <Text className="text-zinc-50 text-2xl font-semibold mb-2">Links importantes</Text>

            <View className="flex-1">

                {links.length > 0 ?
                    <FlatList data={links} keyExtractor={(item) => item.id} renderItem={({ item }) => <TripLink data={item} />} contentContainerClassName="gap-4" />
                    : (

                        <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">Nenhum link adicionado</Text>

                    )}
                <Button className="flex-1" variant="secondary" onPress={() => setShowModal(true)}>
                    <Plus color={colors.zinc[200]} size={20} />
                    <Button.Title>Cadastrar novo link</Button.Title>
                </Button>

            </View>



            <View className="flex-1 min-h-44">
                
                <View className="border-t border-zinc-800 mt-6">
                    <Text className="text-zinc-50 text-2xl font-semibold my-6">Convidados</Text>
                </View>

                <FlatList data={participants} keyExtractor={(part) => part.id} renderItem={({ item }) => <Participant data={item} />} contentContainerClassName="gap-4 pb-44" />

            </View>
            <Modal title="Cadastrar links" subtitle="Todos os convidados podem visualizar os links importantes." visible={showModal} onClose={() => setShowModal(false)}>

                <View className="gap-2 mb-3">

                    <Input variant="secondary">
                        <Input.Field placeholder="Titulo do link" onChangeText={setLinkName} value={linkName} />
                    </Input>

                    <Input variant="secondary">
                        <Input.Field placeholder="URL do link" onChangeText={setLinkURL} value={linkURL} />
                    </Input>

                </View>

                <Button flex className="flex-1" isLoading={isCreatingLinkTrip} onPress={handleCreateLinkTrip}>
                    <Button.Title>Salvar Link</Button.Title>
                </Button>

            </Modal>
        </View>

    )

}