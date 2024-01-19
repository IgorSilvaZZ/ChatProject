const { RoomsRepository } = require("../repositories/RoomsRepository");

class CreateRoomService {
  async handle({ name, fkAdmin, idsParticipants }) {
    if (!name) {
      throw new Error("Field name is invalid!");
    }

    if (!Array.isArray(idsParticipants)) {
      throw new Error("Participants content format invalid!");
    } else if (idsParticipants.length <= 0) {
      throw new Error("It is mandatory to contain at least one participant!");
    }

    if (!fkAdmin) {
      throw new Error("User Admin is invalid!");
    }

    const notRepeatParticipants = [...new Set(idsParticipants)];

    const dataParticipantsRoom = notRepeatParticipants.map((idParticipant) => ({
      name,
      fkAdmin,
      idParticipant,
    }));

    const createRoom = dataParticipantsRoom.map((newRoom) =>
      RoomsRepository.create(newRoom)
    );

    const room = await Promise.all(createRoom);

    return room;
  }
}

module.exports = { CreateRoomService };
