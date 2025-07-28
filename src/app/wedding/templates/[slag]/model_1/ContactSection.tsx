import { Mail, MapPin, Phone } from "lucide-react";
import { useWedding } from "../contexts/WeddingContext";
import messageOnUpdate from "./utils/messageOnUpdate";
import EditableLink from "./Editable/EditableLink";
import EditableText from "./EditableText";

const ContactSection = () => {
    const { weddingData, updateWeddingData } = useWedding();

    const updateContact = async (
        field: "phone" | "email" | "address",
        value: string,
    ) => {
        const isUpdated = await updateWeddingData({
            contact: { ...weddingData.contact, [field]: value },
        });
        messageOnUpdate(isUpdated, field);
    };

    return (
        <section id="contact" className="py-20 px-4">
            <div className="md:container mx-auto">
                <div className="backdrop-blur-md bg-white/30 rounded-3xl p-12 border border-white/20 shadow-xl">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-Faculty-Glyphic">
                        Contact Us
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {/* Phone */}
                        <a href={`tel:${weddingData.contact.phone}`}>
                            <div className="group backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/20 text-center hover:bg-purple-200/20 cursor-pointer h-full">
                                <div className="backdrop-blur-sm bg-purple-100/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 border border-purple-200/30">
                                    <Phone className="text-purple-600 w-full h-full" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Phone
                                </h3>
                                <EditableText
                                    value={weddingData.contact.phone}
                                    onSave={(value) =>
                                        updateContact("phone", value)
                                    }
                                    className="text-purple-600 custome_link"
                                />
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href={`mailto:${weddingData.contact.email}?subject=Wedding Enquiry&body=Hello,`}
                        >
                            <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/20 text-center hover:bg-purple-200/20 cursor-pointer h-full">
                                <div className="backdrop-blur-sm bg-purple-100/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 border border-purple-200/30">
                                    <Mail className="text-purple-600 w-full h-full" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Email
                                </h3>
                                <EditableText
                                    value={weddingData.contact.email}
                                    onSave={(value) =>
                                        updateContact("email", value)
                                    }
                                    className="text-purple-600 custome_link"
                                />
                            </div>
                        </a>

                        {/* Address */}
                        <a
                            href={weddingData.contact.addressMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="group backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/20 text-center hover:bg-purple-200/20 cursor-pointer h-full">
                                <div className="backdrop-blur-sm bg-purple-100/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 border border-purple-200/30">
                                    <MapPin className="text-purple-600 w-full h-full" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Address
                                </h3>
                                <EditableLink
                                    text={weddingData.contact.address}
                                    link={weddingData.contact.addressMapLink}
                                    onSave={(value) =>
                                        updateContact("address", value)
                                    }
                                    className="text-gray-700"
                                />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
