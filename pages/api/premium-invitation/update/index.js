import { prisma } from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { activeSections, otherData } = req.body;

    const eventId = otherData?.eventId;
    if (!eventId) {
      return res.status(400).json({ message: 'Missing eventId' });
    }

    const backgroundUrl = otherData.backgroundUrl || '';
    const sectionBackgroundUrl = otherData.sectionBackgroundUrl || '';
    const songUrl = otherData.songUrl || '';

    const premiumInvitation = await prisma.premiumInvitation.update({
      where: { eventId },
      data: {
        backgroundUrl,
        sectionBackgroundUrl,
        songUrl,
      },
    });

    await prisma.premiumInvitationSection.deleteMany({
      where: { premiumInvitationId: premiumInvitation.id },
    });

    const sectionsData = [];

    activeSections.forEach((sectionId, index) => {
      const sectionContent = otherData[sectionId] || {};

      sectionsData.push({
        premiumInvitationId: premiumInvitation.id,
        type: sectionId,
        version: '1.0.0',
        order: index,
        data: sectionContent,
      });
    });

    await prisma.premiumInvitationSection.createMany({
      data: sectionsData,
    });

    return res.status(200).json({ message: 'Premium Invitation saved successfully' });

  } catch (error) {
    console.error('Error saving premium invitation:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
}