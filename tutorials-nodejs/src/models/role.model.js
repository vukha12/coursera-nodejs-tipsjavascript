import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

const roleSchema = new Schema({
    rol_name: { type: String, default: 'role', emum: ['user', 'shop', 'admin'] },
    rol_slug: { type: String, required: true },
    rol_status: { type: String, default: 'active', enum: ['pending', 'active', 'block'] },
    rol_description: { type: String, default: '' },
    rol_grants: [{
        resource: { type: Schema.Types.ObjectId, ref: 'Resource', require: true },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: '*' },
    }]
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, roleSchema);